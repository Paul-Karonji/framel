'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/validations';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">Profile Settings</h1>
        <p className="text-text-secondary">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input {...register('displayName')} className="pl-10" />
              </div>
              {errors.displayName && (
                <p className="text-xs text-error mt-1">{errors.displayName.message}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input value={user?.email} disabled className="pl-10 bg-gray-50" />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input {...register('phone')} type="tel" placeholder="254700000000" className="pl-10" />
              </div>
              {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <div>
              <p className="font-medium text-text-primary">Account Type</p>
              <p className="text-sm text-text-secondary">Your current account status</p>
            </div>
            <span className="text-sm font-semibold text-primary capitalize">{user?.role}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-primary/10">
            <div>
              <p className="font-medium text-text-primary">Member Since</p>
              <p className="text-sm text-text-secondary">Account creation date</p>
            </div>
            <span className="text-sm text-text-primary">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-text-primary">User ID</p>
              <p className="text-sm text-text-secondary">Your unique identifier</p>
            </div>
            <span className="text-sm text-text-secondary font-mono">{user?.uid?.slice(0, 8)}...</span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-error/20">
        <CardHeader>
          <CardTitle className="text-error">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-text-primary">Delete Account</p>
              <p className="text-sm text-text-secondary">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="outline" className="text-error hover:text-error hover:bg-error/10">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
