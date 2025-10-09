import { useTranslations } from 'next-intl';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function UserProfilePage() {
  const t = useTranslations('dashboard.user.profile');

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

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-norwegian-blue to-blue-600 px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center text-norwegian-blue text-4xl sm:text-5xl font-bold shadow-lg">
              JD
            </div>
            <div className="text-center sm:text-left text-white">
              <h2 className="text-2xl sm:text-3xl font-bold">John Doe</h2>
              <p className="text-blue-100 mt-1">{t('memberSince')}: Jan 2024</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-norwegian-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('email')}
                </p>
                <p className="text-base text-gray-900 mt-1">
                  john.doe@example.com
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('phone')}
                </p>
                <p className="text-base text-gray-900 mt-1">+47 123 45 678</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('location')}
                </p>
                <p className="text-base text-gray-900 mt-1">Oslo, Norway</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('joined')}
                </p>
                <p className="text-base text-gray-900 mt-1">January 15, 2024</p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button className="w-full sm:w-auto px-6 py-3 bg-norwegian-blue text-white font-medium rounded-lg hover:bg-norwegian-blue-600 transition-colors">
              {t('editProfile')}
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('preferences')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">
                {t('emailNotifications')}
              </p>
              <p className="text-sm text-gray-500">
                {t('emailNotificationsDesc')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-norwegian-blue"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">{t('pushNotifications')}</p>
              <p className="text-sm text-gray-500">
                {t('pushNotificationsDesc')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-norwegian-blue"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
