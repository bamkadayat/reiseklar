'use client';

import { useTranslations } from 'next-intl';
import { Edit, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { authService } from '@/lib/api/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const t = useTranslations('dashboard.user.profilePage');
  const { user, loading, error: fetchError, refetch } = useUser();
  const { logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteProfile = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      // Delete the profile
      await authService.deleteProfile();

      // Logout and clear session
      await logout();

      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete profile');
      setDeleteLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading profile: {fetchError}</p>
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
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-8">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {mounted ? greeting : '\u00A0'}, {user.name || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Personal Information */}
      <Card className="bg-white dark:bg-card border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              {t('personalInfo.title')}
            </CardTitle>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {t('personalInfo.edit')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t('personalInfo.fullName')}
              </p>
              <p className="text-lg font-medium text-foreground">{user.name || 'Not set'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {saveError && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-xs font-bold">!</span>
                  </div>
                  <p className="text-sm text-destructive flex-1">{saveError}</p>
                </div>
              )}
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground mb-2 block">
                  {t('personalInfo.fullName')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="h-11 text-base"
                  placeholder="Enter your full name"
                  disabled={saveLoading}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-11"
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
                  className="px-8 h-11"
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
      <Card className="bg-white dark:bg-card border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold">
            {t('loginSecurity.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {t('loginSecurity.email')}
            </p>
            <p className="text-lg font-medium text-foreground mb-3">{user.email}</p>
            {user.emailVerifiedAt && (
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-md px-3 py-2 w-fit">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">{t('loginSecurity.confirmed')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Profile */}
      <Card className="bg-white dark:bg-card border-gray-200 dark:border-gray-700 dark:border-destructive/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-destructive">
            {t('deleteProfile.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('deleteProfile.description')}
          </p>

          <Button
            variant="destructive"
            className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30 h-11 px-6 transition-all"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {t('deleteProfile.button')}
          </Button>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <DialogTitle className="text-xl">Delete Profile</DialogTitle>
                </div>
                <DialogDescription className="text-base pt-2">
                  Are you absolutely sure you want to delete your profile? This action cannot be undone and will permanently delete your account and all associated data.
                </DialogDescription>
              </DialogHeader>

              {deleteError && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-xs font-bold">!</span>
                  </div>
                  <p className="text-sm text-destructive flex-1">{deleteError}</p>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError(null);
                  }}
                  disabled={deleteLoading}
                  className="h-11"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProfile}
                  disabled={deleteLoading}
                  className="h-11"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, delete my profile'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
