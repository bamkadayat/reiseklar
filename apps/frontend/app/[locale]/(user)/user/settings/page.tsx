'use client';

import { useTranslations } from 'next-intl';
import { Bell, Lock, Palette, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UserSettingsPage() {
  const t = useTranslations('dashboard.user.settingsPage');

  // State for all settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch user settings on mount (when backend is ready)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // TODO: Fetch user settings from backend
        // setLoading(true);
        // const data = await userService.getSettings();
        // setEmailNotifications(data.emailNotifications);
        // ... set other fields
        // setLoading(false);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save settings to backend
      console.log('Saving user settings...');
      setTimeout(() => {
        setSaving(false);
        alert('Settings saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaving(false);
      alert('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-norwegian-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-norwegian-blue" />
              <h2 className="text-lg font-semibold text-gray-900">
                {t('notifications')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {t('emailNotifications')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('emailNotificationsDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-norwegian-blue"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {t('pushNotifications')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('pushNotificationsDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-norwegian-blue"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t('smsAlerts')}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('smsAlertsDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-norwegian-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-norwegian-blue" />
              <h2 className="text-lg font-semibold text-gray-900">
                {t('privacy')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 px-4 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {t('changePassword')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('changePasswordDesc')}
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {t('twoFactorAuth')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('twoFactorAuthDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-norwegian-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-norwegian-blue" />
              <h2 className="text-lg font-semibold text-gray-900">
                {t('preferences')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('language')}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwegian-blue focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="nb">Norsk (Bokmål)</option>
              </select>
            </div>
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('theme')}
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwegian-blue focus:border-transparent"
              >
                <option value="light">{t('light')}</option>
                <option value="dark">{t('dark')}</option>
                <option value="system">{t('system')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-norwegian-blue text-white font-medium rounded-lg hover:bg-norwegian-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}
