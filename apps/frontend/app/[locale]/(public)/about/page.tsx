"use client";

import { useTranslations } from "next-intl";
import {
  HiLightBulb,
  HiUserGroup,
  HiSparkles,
  HiMapPin,
  HiClock,
  HiArrowPath,
} from "react-icons/hi2";
import { FaLeaf } from "react-icons/fa";
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

  const features = [
    {
      icon: HiMapPin,
      title: t("features.smartRouting.title"),
      description: t("features.smartRouting.description"),
    },
    {
      icon: HiClock,
      title: t("features.realTime.title"),
      description: t("features.realTime.description"),
    },
    {
      icon: FaLeaf,
      title: t("features.ecoFriendly.title"),
      description: t("features.ecoFriendly.description"),
    },
    {
      icon: HiArrowPath,
      title: t("features.multiModal.title"),
      description: t("features.multiModal.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fade-in">
            {/* Text above image */}
            <h1 className="text-3xl md:text-4xl font-normal text-primary mb-12 leading-tight max-w-3xl mx-auto">
              Reiseklar makes commuting in Norway easier and greener.
            </h1>

            {/* Image */}
            <div className="flex items-center justify-center mb-12">
              <Image
                src="/images/about.svg"
                alt="About Reiseklar"
                width={500}
                height={300}
                className="w-full max-w-lg h-auto"
                priority
              />
            </div>

            {/* Text below image */}
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We use real-time data to find you the best routes across all
              transit options, saving you time and reducing your carbon
              footprint. Join thousands already commuting smarter.
            </p>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              {t("features.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 transform group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                        <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              {t("values.title")}
            </h2>
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
