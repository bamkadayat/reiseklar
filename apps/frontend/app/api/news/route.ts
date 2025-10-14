import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
  categories: string[];
}

export async function GET() {
  try {
    const rssUrl = process.env.NEXT_PUBLIC_NRK_RSS_URL || '';

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Reiseklar reiseklar.no contact@reiseklar.no',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed');
    }

    const xmlText = await response.text();

    // Parse XML RSS feed using fast-xml-parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    const result = parser.parse(xmlText);
    const items = result.rss?.channel?.item || [];
    const newsItems: NewsItem[] = [];

    // Keywords for filtering travel and weather related news
    const travelKeywords = [
      'reise', 'reis', 'fly', 'tog', 'buss', 'transport', 'trafikk',
      'vei', 'bane', 'rute', 'flyplass', 'jernbane', 'kollektiv',
      'travel', 'tourism', 'turisme', 'ferie', 'holiday'
    ];

    const weatherKeywords = [
      'vær', 'været', 'varsel', 'storm', 'regn', 'snø', 'sol',
      'temperatur', 'vind', 'yr', 'meteorolog', 'klima', 'uvær',
      'torden', 'lyn', 'frost', 'is', 'flom', 'ras',
      'weather', 'forecast', 'temperature', 'wind', 'rain', 'snow'
    ];

    const relevantKeywords = [...travelKeywords, ...weatherKeywords];

    // Ensure items is an array
    const itemsArray = Array.isArray(items) ? items : [items];

    itemsArray.forEach((item: any) => {
      const title = item.title || '';
      const link = item.link || '';
      const description = item.description || '';
      const pubDate = item.pubDate || '';

      // Get categories
      const categories: string[] = [];
      if (item.category) {
        if (Array.isArray(item.category)) {
          categories.push(...item.category);
        } else {
          categories.push(item.category);
        }
      }

      // Get image URL from media:content or enclosure
      let imageUrl: string | undefined;
      if (item['media:content']?.[0]?.['@_url']) {
        imageUrl = item['media:content'][0]['@_url'];
      } else if (item['media:content']?.['@_url']) {
        imageUrl = item['media:content']['@_url'];
      } else if (item.enclosure?.['@_url']) {
        imageUrl = item.enclosure['@_url'];
      }

      // Filter for travel and weather related news
      const contentToCheck = `${title} ${description} ${categories.join(' ')}`.toLowerCase();
      const isRelevant = relevantKeywords.some(keyword =>
        contentToCheck.includes(keyword.toLowerCase())
      );

      if (isRelevant && newsItems.length < 5) {
        newsItems.push({
          title,
          link,
          description,
          pubDate,
          imageUrl,
          categories,
        });
      }
    });

    // If no relevant news found, return top 5 general news
    if (newsItems.length === 0) {
      itemsArray.slice(0, 5).forEach((item: any) => {
        const title = item.title || '';
        const link = item.link || '';
        const description = item.description || '';
        const pubDate = item.pubDate || '';

        const categories: string[] = [];
        if (item.category) {
          if (Array.isArray(item.category)) {
            categories.push(...item.category);
          } else {
            categories.push(item.category);
          }
        }

        let imageUrl: string | undefined;
        if (item['media:content']?.[0]?.['@_url']) {
          imageUrl = item['media:content'][0]['@_url'];
        } else if (item['media:content']?.['@_url']) {
          imageUrl = item['media:content']['@_url'];
        } else if (item.enclosure?.['@_url']) {
          imageUrl = item.enclosure['@_url'];
        }

        newsItems.push({
          title,
          link,
          description,
          pubDate,
          imageUrl,
          categories,
        });
      });
    }

    // Sort news by date in descending order (most recent first)
    newsItems.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ news: newsItems });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
