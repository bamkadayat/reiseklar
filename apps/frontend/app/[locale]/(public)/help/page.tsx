"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  HiMagnifyingGlass,
  HiMapPin,
  HiBookmark,
  HiUserCircle,
  HiCog6Tooth,
  HiQuestionMarkCircle,
} from "react-icons/hi2";

export default function HelpPage() {
  const t = useTranslations("help");

  const sections = [
    { id: "gettingStarted", icon: HiQuestionMarkCircle },
    { id: "searchingRoutes", icon: HiMagnifyingGlass },
    { id: "savingRoutes", icon: HiBookmark },
    { id: "account", icon: HiUserCircle },
    { id: "settings", icon: HiCog6Tooth },
    { id: "troubleshooting", icon: HiQuestionMarkCircle },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>

        {/* Demo Notice */}
        <div className="mb-10 p-6 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-blue-800 leading-relaxed">
            {t("demoNotice")}
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12 grid md:grid-cols-3 gap-4">
          <Link
            href="#gettingStarted"
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <HiQuestionMarkCircle className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">
              {t("quickLinks.gettingStarted")}
            </h3>
          </Link>
          <Link
            href="#searchingRoutes"
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <HiMagnifyingGlass className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">
              {t("quickLinks.searchRoutes")}
            </h3>
          </Link>
          <Link
            href="#troubleshooting"
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <HiQuestionMarkCircle className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">
              {t("quickLinks.troubleshooting")}
            </h3>
          </Link>
        </div>

        {/* Getting Started */}
        <section id="gettingStarted" className="mb-10 scroll-mt-4">
          <div className="flex items-center gap-3 mb-4">
            <HiQuestionMarkCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-primary">
              {t("gettingStarted.title")}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("gettingStarted.intro")}
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("gettingStarted.steps.step1")}</li>
            <li>{t("gettingStarted.steps.step2")}</li>
            <li>{t("gettingStarted.steps.step3")}</li>
            <li>{t("gettingStarted.steps.step4")}</li>
          </ol>
        </section>

        {/* Searching Routes */}
        <section id="searchingRoutes" className="mb-10 scroll-mt-4">
          <div className="flex items-center gap-3 mb-4">
            <HiMagnifyingGlass className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-primary">
              {t("searchingRoutes.title")}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("searchingRoutes.description")}
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("searchingRoutes.enterLocations.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("searchingRoutes.enterLocations.description")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("searchingRoutes.viewResults.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("searchingRoutes.viewResults.description")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("searchingRoutes.filters.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("searchingRoutes.filters.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Saving Routes */}
        <section id="savingRoutes" className="mb-10 scroll-mt-4">
          <div className="flex items-center gap-3 mb-4">
            <HiBookmark className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-primary">
              {t("savingRoutes.title")}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("savingRoutes.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("savingRoutes.benefits.quick")}</li>
            <li>{t("savingRoutes.benefits.organize")}</li>
            <li>{t("savingRoutes.benefits.track")}</li>
          </ul>
        </section>

        {/* Account Management */}
        <section id="account" className="mb-10 scroll-mt-4">
          <div className="flex items-center gap-3 mb-4">
            <HiUserCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-primary">
              {t("account.title")}
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("account.create.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("account.create.description")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("account.update.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("account.update.description")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("account.delete.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("account.delete.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section id="settings" className="mb-10 scroll-mt-4">
          <div className="flex items-center gap-3 mb-4">
            <HiCog6Tooth className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-primary">
              {t("settings.title")}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("settings.description")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>{t("settings.options.language")}</li>
            <li>{t("settings.options.notifications")}</li>
            <li>{t("settings.options.privacy")}</li>
            <li>{t("settings.options.preferences")}</li>
          </ul>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-10 scroll-mt-4">
          <div className="flex items-center gap-3 mb-4">
            <HiQuestionMarkCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-primary">
              {t("troubleshooting.title")}
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("troubleshooting.noResults.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("troubleshooting.noResults.solution")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("troubleshooting.loginIssues.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("troubleshooting.loginIssues.solution")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("troubleshooting.slowLoading.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t("troubleshooting.slowLoading.solution")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("contact.description")}
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>{t("contact.email")}:</strong>{" "}
              <a
                href="mailto:support@reiseklar.no"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                support@reiseklar.no
              </a>
            </p>
            <p className="text-gray-700">
              <strong>{t("contact.note")}:</strong>{" "}
              {t("contact.noteDescription")}
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
