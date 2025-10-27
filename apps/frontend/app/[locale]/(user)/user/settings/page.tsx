'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Bell, Palette, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/api/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function UserSettingsPage() {
  const t = useTranslations('dashboard.user.settingsPage');
  const { theme, setTheme } = useTheme();
  const { refreshUser } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // State for all settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState(locale);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');

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
      // Save theme and language to backend
      await authService.updateProfile({
        theme: theme as 'light' | 'dark' | 'system',
        language: language as 'en' | 'nb',
      });

      // Refresh user data in AuthContext to get updated preferences
      await refreshUser();

      // Save language by navigating to new locale if changed
      if (language !== locale) {
        const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
        setSaving(false);
        setAlertType('success');
        setAlertMessage('Settings saved successfully! Switching language...');
        setAlertOpen(true);
        // Navigate to new locale after a short delay
        setTimeout(() => {
          router.push(`/${language}${pathnameWithoutLocale}`);
        }, 1000);
      } else {
        // No language change, just show success
        setSaving(false);
        setAlertType('success');
        setAlertMessage('Settings saved successfully!');
        setAlertOpen(true);
      }

      // TODO: Save other settings to backend (notifications, etc.)
      console.log('Saved user settings:', {
        theme,
        language,
        emailNotifications,
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaving(false);
      setAlertType('error');
      setAlertMessage('Failed to save settings. Please try again.');
      setAlertOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-norwegian-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-norwegian-blue" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('notifications')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {t('emailNotifications')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('emailNotificationsDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4" aria-label="Toggle email notifications">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  aria-label="Enable email notifications"
                />
                <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-norwegian-blue" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('preferences')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('language')}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="en">English</option>
                <option value="nb">Norsk (Bokmål)</option>
              </select>
            </div>
            <div className="space-y-2 border-t border-border pt-4">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('theme')}
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
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
            className="px-6 py-3 border border-input text-muted-foreground font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : t('saveChanges')}
          </button>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {alertType === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <AlertDialogTitle>
                {alertType === 'success' ? 'Success' : 'Error'}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base pt-2">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertOpen(false)}
              className="bg-norwegian-blue hover:bg-norwegian-blue-600"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
