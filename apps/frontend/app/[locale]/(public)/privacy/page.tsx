"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacyPolicy");

  const sections = [
    "introduction",
    "dataController",
    "dataCollection",
    "howWeUseData",
    "legalBasis",
    "dataSharing",
    "dataRetention",
    "yourRights",
    "security",
    "childrenPrivacy",
    "changes",
    "contact",
  ];

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

        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary mb-4">
            {t("tableOfContents")}
          </h2>
          <ul className="space-y-2">
            {sections.map((section, index) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {index + 1}. {t(`${section}.title`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Introduction */}
        <section id="introduction" className="mb-10 scroll-mt-4">
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

        {/* Data Controller */}
        <section id="dataController" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("dataController.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("dataController.description")}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              <strong>{t("dataController.companyName")}:</strong> Reiseklar AS
            </p>
            <p className="text-gray-700">
              <strong>{t("dataController.email")}:</strong>{" "}
              <a
                href="mailto:privacy@reiseklar.no"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                privacy@reiseklar.no
              </a>
            </p>
          </div>
        </section>

        {/* Data Collection */}
        <section id="dataCollection" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("dataCollection.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("dataCollection.description")}
          </p>

          <div className="space-y-6">
            {/* Account Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("dataCollection.categories.account.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                {t("dataCollection.categories.account.description")}
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>{t("dataCollection.categories.account.items.name")}</li>
                <li>{t("dataCollection.categories.account.items.email")}</li>
                <li>{t("dataCollection.categories.account.items.password")}</li>
              </ul>
            </div>

            {/* Travel Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("dataCollection.categories.travel.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                {t("dataCollection.categories.travel.description")}
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>{t("dataCollection.categories.travel.items.routes")}</li>
                <li>{t("dataCollection.categories.travel.items.searches")}</li>
                <li>{t("dataCollection.categories.travel.items.preferences")}</li>
              </ul>
            </div>

            {/* Technical Data */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("dataCollection.categories.technical.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                {t("dataCollection.categories.technical.description")}
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>{t("dataCollection.categories.technical.items.ip")}</li>
                <li>{t("dataCollection.categories.technical.items.browser")}</li>
                <li>{t("dataCollection.categories.technical.items.device")}</li>
                <li>{t("dataCollection.categories.technical.items.usage")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Data */}
        <section id="howWeUseData" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("howWeUseData.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("howWeUseData.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("howWeUseData.purposes.provideServices")}</li>
            <li>{t("howWeUseData.purposes.personalizeExperience")}</li>
            <li>{t("howWeUseData.purposes.improveServices")}</li>
            <li>{t("howWeUseData.purposes.communication")}</li>
            <li>{t("howWeUseData.purposes.security")}</li>
            <li>{t("howWeUseData.purposes.legal")}</li>
          </ul>
        </section>

        {/* Legal Basis */}
        <section id="legalBasis" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("legalBasis.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("legalBasis.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("legalBasis.bases.consent")}</li>
            <li>{t("legalBasis.bases.contract")}</li>
            <li>{t("legalBasis.bases.legitimate")}</li>
            <li>{t("legalBasis.bases.legal")}</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section id="dataSharing" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("dataSharing.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("dataSharing.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("dataSharing.parties.serviceProviders")}</li>
            <li>{t("dataSharing.parties.transitProviders")}</li>
            <li>{t("dataSharing.parties.legal")}</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            {t("dataSharing.noSelling")}
          </p>
        </section>

        {/* Data Retention */}
        <section id="dataRetention" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("dataRetention.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("dataRetention.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("dataRetention.periods.account")}</li>
            <li>{t("dataRetention.periods.travel")}</li>
            <li>{t("dataRetention.periods.logs")}</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section id="yourRights" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("yourRights.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("yourRights.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <strong>{t("yourRights.rights.access.title")}:</strong>{" "}
              {t("yourRights.rights.access.description")}
            </li>
            <li>
              <strong>{t("yourRights.rights.rectification.title")}:</strong>{" "}
              {t("yourRights.rights.rectification.description")}
            </li>
            <li>
              <strong>{t("yourRights.rights.erasure.title")}:</strong>{" "}
              {t("yourRights.rights.erasure.description")}
            </li>
            <li>
              <strong>{t("yourRights.rights.restriction.title")}:</strong>{" "}
              {t("yourRights.rights.restriction.description")}
            </li>
            <li>
              <strong>{t("yourRights.rights.portability.title")}:</strong>{" "}
              {t("yourRights.rights.portability.description")}
            </li>
            <li>
              <strong>{t("yourRights.rights.objection.title")}:</strong>{" "}
              {t("yourRights.rights.objection.description")}
            </li>
            <li>
              <strong>{t("yourRights.rights.complaint.title")}:</strong>{" "}
              {t("yourRights.rights.complaint.description")}
            </li>
          </ul>
        </section>

        {/* Security */}
        <section id="security" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("security.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("security.description")}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t("security.measures")}
          </p>
        </section>

        {/* Children's Privacy */}
        <section id="childrenPrivacy" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("childrenPrivacy.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("childrenPrivacy.description")}
          </p>
        </section>

        {/* Changes */}
        <section id="changes" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("changes.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("changes.description")}
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-10 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("contact.description")}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-2">
              <strong>{t("contact.email")}:</strong>{" "}
              <a
                href="mailto:privacy@reiseklar.no"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                privacy@reiseklar.no
              </a>
            </p>
            <p className="text-gray-700">
              <strong>{t("contact.datatilsynet.title")}:</strong>{" "}
              {t("contact.datatilsynet.description")}{" "}
              <a
                href="https://www.datatilsynet.no"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                www.datatilsynet.no
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
