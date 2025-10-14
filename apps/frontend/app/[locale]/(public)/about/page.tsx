import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    {
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
    },
    {
      title: t('values.community.title'),
      description: t('values.community.description'),
    },
    {
      title: t('values.sustainability.title'),
      description: t('values.sustainability.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-32 pb-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-gray-600 mb-8 tracking-wide">
            {t('hero.title')}
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-normal text-gray-900 mb-10">
            {t('mission.description1')}
          </h1>
        </div>
      </section>

      {/* Illustration */}
      <section className="pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Image
              src="/images/about.svg"
              alt="About Reiseklar"
              width={500}
              height={300}
              className="w-full max-w-lg h-auto"
              priority
            /></div>
        </div>
      </section>

      {/* Description */}
      <section className="pb-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('mission.description2')}
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 text-center mb-16">
            {t('values.title')}
          </h2>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
