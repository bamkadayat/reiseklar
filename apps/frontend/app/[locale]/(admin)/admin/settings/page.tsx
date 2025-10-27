'use client';

import { useTranslations } from 'next-intl';
import { Globe, Shield, Mail, Key, Palette, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
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

export default function AdminSettingsPage() {
  const t = useTranslations('dashboard.admin.settingsPage');
  const { theme, setTheme } = useTheme();
  const { refreshUser } = useAuth();

  // State for all settings
  const [siteName, setSiteName] = useState('Reiseklar');
  const [siteDescription, setSiteDescription] = useState(
    'Smart Commute Planner for Norway'
  );
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [rateLimit, setRateLimit] = useState('1000');
  const [fromEmail, setFromEmail] = useState('noreply@reiseklar.no');
  const [fromName, setFromName] = useState('Reiseklar');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  // Fetch settings on mount (when backend is ready)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // TODO: Fetch settings from backend
        // setLoading(true);
        // const data = await settingsService.getSettings();
        // setSiteName(data.siteName);
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
      // Save admin user's theme preference to backend
      await authService.updateProfile({
        theme: theme as 'light' | 'dark' | 'system',
      });

      // Refresh user data in AuthContext to get updated preferences
      await refreshUser();

      // TODO: Save system-wide settings to backend
      console.log('Saving admin settings...', {
        siteName,
        siteDescription,
        maintenanceMode,
        requireEmailVerification,
        twoFactorAuth,
        sessionTimeout,
        rateLimit,
        fromEmail,
        fromName,
        theme,
      });

      setSaving(false);
      setAlertType('success');
      setAlertMessage('Settings saved successfully!');
      setAlertOpen(true);
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
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        {/* General Settings */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('general')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('siteName')}
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('siteDescription')}
              </label>
              <textarea
                rows={3}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {t('maintenanceMode')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('maintenanceModeDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4" aria-label="Toggle maintenance mode">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  aria-label="Enable maintenance mode"
                />
                <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-destructive"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('security')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {t('requireEmailVerification')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('requireEmailVerificationDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4" aria-label="Toggle email verification requirement">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={requireEmailVerification}
                  onChange={(e) =>
                    setRequireEmailVerification(e.target.checked)
                  }
                  aria-label="Require email verification"
                />
                <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {t('twoFactorAuth')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('twoFactorAuthDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4" aria-label="Toggle two-factor authentication">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  aria-label="Enable two-factor authentication"
                />
                <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="space-y-2 border-t border-border pt-4">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('sessionTimeout')}
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('apiSettings')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('apiKey')}
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="flex-1 px-4 py-2 border border-input rounded-lg bg-muted text-foreground"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
                  {t('regenerate')}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('rateLimitPerHour')}
              </label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('email')}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('fromEmail')}
              </label>
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {t('fromName')}
              </label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Preferences
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="dashboard-theme" className="block text-sm font-medium text-muted-foreground">
                Dashboard Theme
              </label>
              <select
                id="dashboard-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose your preferred dashboard theme appearance
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-input text-muted-foreground font-medium rounded-lg hover:bg-muted transition-colors"
          >
            {t('cancel')}
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
              className="bg-norwegian-blue hover:bg-primary/90"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
