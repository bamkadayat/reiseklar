"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CookiePolicyPage() {
  const t = useTranslations("cookiePolicy");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg">
            {t("lastUpdated")}: {t("date")}
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("intro.paragraph1")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t("intro.paragraph2")}
          </p>
        </section>

        {/* What Are Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("whatAreCookies.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("whatAreCookies.description")}
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("howWeUseCookies.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("howWeUseCookies.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("howWeUseCookies.reasons.authentication")}</li>
            <li>{t("howWeUseCookies.reasons.preferences")}</li>
            <li>{t("howWeUseCookies.reasons.analytics")}</li>
            <li>{t("howWeUseCookies.reasons.security")}</li>
          </ul>
        </section>

        {/* Types of Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("typesOfCookies.title")}
          </h2>

          {/* Essential Cookies */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("typesOfCookies.essential.title")}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {t("typesOfCookies.essential.description")}
            </p>
          </div>

          {/* Functional Cookies */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("typesOfCookies.functional.title")}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {t("typesOfCookies.functional.description")}
            </p>
          </div>

          {/* Analytics Cookies */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("typesOfCookies.analytics.title")}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {t("typesOfCookies.analytics.description")}
            </p>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("managingCookies.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("managingCookies.description")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t("managingCookies.warning")}
          </p>
        </section>

        {/* Third-Party Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("thirdPartyCookies.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("thirdPartyCookies.description")}
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("changes.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("changes.description")}
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("contact.description")}
          </p>
          <p className="text-gray-700">
            <strong>{t("contact.email")}:</strong>{" "}
            <a
              href="mailto:privacy@reiseklar.no"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              privacy@reiseklar.no
            </a>
          </p>
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
