'use client';

import { useTranslations } from 'next-intl';
import { Edit, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { authService } from '@/lib/api/auth.service';

export default function UserProfilePage() {
  const t = useTranslations('dashboard.user.profilePage');
  const { user, loading, error: fetchError, refetch } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Get dynamic greeting based on Norway time
    const norwayTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Oslo' });
    const hour = new Date(norwayTime).getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting(t('greetings.morning'));
    } else if (hour >= 12 && hour < 18) {
      setGreeting(t('greetings.afternoon'));
    } else {
      setGreeting(t('greetings.evening'));
    }
  }, [t]);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      await authService.updateProfile({ name: formData.fullName });
      await refetch();
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        fullName: user.name || ''
      });
    }
    setSaveError(null);
    setIsEditing(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400">Error loading profile: {fetchError}</p>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          {mounted ? greeting : '\u00A0'}, {user.name || 'User'}
        </h1>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t('personalInfo.title')}
            </CardTitle>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-1" />
                {t('personalInfo.edit')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('personalInfo.fullName')}
              </p>
              <p className="text-base text-gray-900 dark:text-white">{user.name || 'Not set'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {saveError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
                </div>
              )}
              <div>
                <Label htmlFor="fullName" className="text-sm text-gray-600 dark:text-gray-400">
                  {t('personalInfo.fullName')} <span className="text-red-600 dark:text-red-400">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="mt-1"
                  disabled={saveLoading}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8"
                  disabled={saveLoading}
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    t('personalInfo.save')
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="px-8"
                  disabled={saveLoading}
                >
                  {t('personalInfo.cancel')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login and Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('loginSecurity.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('loginSecurity.email')}
            </p>
            <p className="text-base text-gray-900 dark:text-white mb-2">{user.email}</p>
            {user.emailVerifiedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-900 dark:text-white">{t('loginSecurity.confirmed')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('deleteProfile.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('deleteProfile.description')}
          </p>
          <Button variant="destructive" className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 border-0">
            {t('deleteProfile.button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
