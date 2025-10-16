import { useTranslations } from "next-intl";
import { HiLightBulb, HiUserGroup, HiSparkles } from "react-icons/hi2";
import Image from "next/image";

export default function AboutPage() {
  const t = useTranslations("about");

  const values = [
    {
      icon: HiLightBulb,
      title: t("values.innovation.title"),
      description: t("values.innovation.description"),
    },
    {
      icon: HiUserGroup,
      title: t("values.community.title"),
      description: t("values.community.description"),
    },
    {
      icon: HiSparkles,
      title: t("values.sustainability.title"),
      description: t("values.sustainability.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {t("hero.title")}
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-1 bg-blue-800 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-8 h-1 bg-blue-800 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12 shadow-sm border border-blue-100">
            <p className="text-xl md:text-1xl text-gray-700 leading-relaxed text-center font-light">
              {t("mission.description1")}
            </p>
          </div>
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
            />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="pb-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            {t("mission.description2")}
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              {t("values.title")}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  {/* Content */}
                  <div className="relative">
                    {/* Icon with Background */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 mb-6 transform group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                      <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600 opacity-5 rounded-bl-full"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
