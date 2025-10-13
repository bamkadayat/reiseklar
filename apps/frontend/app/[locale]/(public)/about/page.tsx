import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  const t = useTranslations('about');

  const features = [
    {
      title: t('features.smartRouting.title'),
      description: t('features.smartRouting.description'),
    },
    {
      title: t('features.realTime.title'),
      description: t('features.realTime.description'),
    },
    {
      title: t('features.ecoFriendly.title'),
      description: t('features.ecoFriendly.description'),
    },
    {
      title: t('features.multiModal.title'),
      description: t('features.multiModal.description'),
    },
  ];

  const stats = [
    { label: t('stats.users'), value: '10,000+' },
    { label: t('stats.routes'), value: '50,000+' },
    { label: t('stats.co2Saved'), value: '125 tons' },
    { label: t('stats.timeSaved'), value: '5,000 hrs' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signUp">
              <Button size="lg" className="px-8">
                {t('hero.getStarted')}
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="px-8">
                {t('hero.learnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-2">
                {t('mission.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('mission.description1')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('mission.description2')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('values.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {t('values.innovation.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.innovation.description')}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {t('values.community.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.community.description')}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {t('values.sustainability.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.sustainability.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                {t('cta.description')}
              </p>
              <Link href="/signUp">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 text-lg"
                >
                  {t('cta.button')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
