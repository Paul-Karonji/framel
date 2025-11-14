'use client';

import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import apiClient from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface User {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  disabled?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      // Note: This endpoint needs to be created in the backend
      // For now, we'll show a placeholder
      // const response = await apiClient.get('/admin/users');
      // setUsers(response.data.users || []);

      // Placeholder data
      toast('User management API endpoint pending implementation');
      setUsers([]);
      setFilteredUsers([]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (uid: string, newRole: 'customer' | 'admin') => {
    try {
      await apiClient.put(`/auth/users/${uid}/role`, { role: newRole });
      setUsers((prev) => prev.map((user) => (user.uid === uid ? { ...user, role: newRole } : user)));
      toast.success('User role updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">Users Management</h1>
        <p className="text-text-secondary">Manage user accounts and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Total Users</p>
                <p className="text-2xl font-bold text-text-primary">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Customers</p>
                <p className="text-2xl font-bold text-text-primary">
                  {users.filter((u) => u.role === 'customer').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Admins</p>
                <p className="text-2xl font-bold text-text-primary">
                  {users.filter((u) => u.role === 'admin').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-primary/30 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-text-secondary">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-primary/10">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">User</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Contact</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">
                    Joined Date
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-secondary">
                      <div className="flex flex-col items-center gap-2">
                        <UsersIcon className="h-12 w-12 text-text-secondary/50" />
                        <p>No users found</p>
                        <p className="text-xs">User management API endpoint is pending implementation</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.uid} className="border-b border-primary/10 hover:bg-background/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {user.displayName?.charAt(0).toUpperCase() ||
                                user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {user.displayName || 'N/A'}
                            </p>
                            <p className="text-xs text-text-secondary flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {user.phone ? (
                          <span className="text-sm text-text-primary flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </span>
                        ) : (
                          <span className="text-sm text-text-secondary">No phone</span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateUserRole(user.uid, e.target.value as 'customer' | 'admin')
                          }
                          className={`text-xs px-2 py-1 rounded border-0 font-medium ${
                            user.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary/10 text-secondary'
                          }`}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-text-primary flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={user.disabled ? 'outline' : 'default'}
                          className={
                            user.disabled
                              ? 'text-error border-error'
                              : 'bg-success/10 text-success border-success'
                          }
                        >
                          {user.disabled ? 'Disabled' : 'Active'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
