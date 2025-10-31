"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function TermsOfServicePage() {
  const t = useTranslations("termsOfService");

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

        {/* Important Notice */}
        <div className="mb-10 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            {t("notice.title")}
          </h2>
          <p className="text-yellow-800 leading-relaxed">
            {t("notice.description")}
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("introduction.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("introduction.paragraph1")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t("introduction.paragraph2")}
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("acceptance.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("acceptance.description")}
          </p>
        </section>

        {/* Use of Service */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("useOfService.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("useOfService.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("useOfService.rules.age")}</li>
            <li>{t("useOfService.rules.accurate")}</li>
            <li>{t("useOfService.rules.security")}</li>
            <li>{t("useOfService.rules.lawful")}</li>
            <li>{t("useOfService.rules.noHarm")}</li>
          </ul>
        </section>

        {/* User Accounts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("userAccounts.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("userAccounts.paragraph1")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t("userAccounts.paragraph2")}
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("intellectualProperty.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("intellectualProperty.paragraph1")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t("intellectualProperty.paragraph2")}
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("thirdParty.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("thirdParty.description")}
          </p>
        </section>

        {/* Disclaimer */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("disclaimer.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 uppercase font-semibold">
            {t("disclaimer.important")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t("disclaimer.description")}
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("liability.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("liability.description")}
          </p>
        </section>

        {/* Termination */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("termination.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("termination.description")}
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("changes.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("changes.description")}
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("governingLaw.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("governingLaw.description")}
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
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              <strong>{t("contact.email")}:</strong>{" "}
              <a
                href="mailto:support@reiseklar.no"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                support@reiseklar.no
              </a>
            </p>
          </div>
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
