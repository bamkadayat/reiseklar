'use client';

import { useTranslations } from 'next-intl';
import { Search, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService } from '@/lib/api/admin.service';
import type { AdminUser } from '@reiseklar/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminUsersPage() {
  const t = useTranslations('dashboard.admin.usersPage');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });
  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    userId: string | null;
    currentRole: 'USER' | 'ADMIN' | null;
  }>({
    open: false,
    userId: null,
    currentRole: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase().trim();
      setFilteredUsers(
        users.filter(
          (user) =>
            (user.name?.toLowerCase() || '').includes(query) ||
            (user.email?.toLowerCase() || '').includes(query) ||
            (user.role?.toLowerCase() || '').includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog.userId) return;

    try {
      await adminService.deleteUser(deleteDialog.userId);
      await fetchUsers();
      setDeleteDialog({ open: false, userId: null });
    } catch (error: any) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleToggleRole = async () => {
    if (!roleDialog.userId || !roleDialog.currentRole) return;

    const newRole = roleDialog.currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

    try {
      await adminService.updateUserRole(roleDialog.userId, newRole);
      await fetchUsers();
      setRoleDialog({ open: false, userId: null, currentRole: null });
    } catch (error: any) {
      alert(error.message || 'Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 shadow-sm hover:shadow-md transition-all whitespace-nowrap">
          <UserPlus className="w-5 h-5" />
          {t('addUser')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <p className="text-sm text-muted-foreground">{t('totalUsers')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{users.length}</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <p className="text-sm text-muted-foreground">{t('activeUsers')}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {users.filter((u) => u.status === 'Active').length}
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <p className="text-sm text-muted-foreground">{t('totalTrips')}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {users.reduce((sum, u) => sum + u.trips, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <p className="text-sm text-muted-foreground">{t('admins')}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {users.filter((u) => u.role === 'ADMIN').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchUsers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-muted rounded-full p-1 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mt-3 text-sm text-muted-foreground">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('joinDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('trips')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="w-12 h-12 text-muted-foreground mb-3" />
                      <p className="text-lg font-medium text-foreground mb-1">No users found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? `No users match "${searchQuery}". Try a different search.`
                          : 'No users available.'}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent/10 text-accent-foreground'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Active'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(user.joinDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                    {user.trips}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setRoleDialog({ open: true, userId: user.id, currentRole: user.role })}
                        className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, userId: user.id })}
                        className="px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Search className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium text-foreground mb-1">No users found</p>
                <p className="text-sm">
                  {searchQuery
                    ? `No users match "${searchQuery}". Try a different search.`
                    : 'No users available.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setRoleDialog({ open: true, userId: user.id, currentRole: user.role })}
                    className="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors whitespace-nowrap"
                  >
                    Toggle Role
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, userId: user.id })}
                    className="px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent/10 text-accent-foreground'
                    }`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{user.trips} trips</span>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, userId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteDialog({ open: false, userId: null })}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Role Dialog */}
      <Dialog open={roleDialog.open} onOpenChange={(open) => setRoleDialog({ open, userId: null, currentRole: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this user&apos;s role from{' '}
              <span className="font-semibold">{roleDialog.currentRole}</span> to{' '}
              <span className="font-semibold">
                {roleDialog.currentRole === 'ADMIN' ? 'USER' : 'ADMIN'}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setRoleDialog({ open: false, userId: null, currentRole: null })}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleRole}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
            >
              Change Role
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
