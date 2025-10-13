'use client';

import { useTranslations } from 'next-intl';
import { Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function UserProfilePage() {
  const t = useTranslations('dashboard.user.profilePage');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Bam Kadayat'
  });

  // Get dynamic greeting based on Norway time
  const getGreeting = () => {
    const norwayTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Oslo' });
    const hour = new Date(norwayTime).getHours();

    if (hour >= 5 && hour < 12) {
      return t('greetings.morning');
    } else if (hour >= 12 && hour < 18) {
      return t('greetings.afternoon');
    } else {
      return t('greetings.evening');
    }
  };

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data if needed
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {getGreeting()}, {formData.fullName}
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
                className="text-blue-600 hover:text-blue-700"
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
              <p className="text-sm text-gray-600 mb-1">
                {t('personalInfo.fullName')}
              </p>
              <p className="text-base text-gray-900">{formData.fullName}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm text-gray-600">
                  {t('personalInfo.fullName')} <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8"
                >
                  {t('personalInfo.save')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="px-8"
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
            <p className="text-sm text-gray-600 mb-1">
              {t('loginSecurity.email')}
            </p>
            <p className="text-base text-gray-900 mb-2">bamkadayat@gmail.com</p>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-900">{t('loginSecurity.confirmed')}</span>
            </div>
            <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
              {t('loginSecurity.changeEmail')}
            </Button>
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
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('deleteProfile.description')}
          </p>
          <Button variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-0">
            {t('deleteProfile.button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
