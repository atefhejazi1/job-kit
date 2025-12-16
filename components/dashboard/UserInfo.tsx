'use client';

import { useAuth, useUserType } from '@/contexts/AuthContext';
import Avatar from '@/components/ui/Avatar';
import { Building, User, Mail, Calendar, Shield, Loader2 } from 'lucide-react';

export default function UserInfo() {
  const { user, isLoading } = useAuth();
  const { userType, isCompany, isUser } = useUserType();

  // --- Loading State (Skeleton) ---
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-slate-800 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            {/* Avatar Placeholder */}
            <div className="h-16 w-16 bg-gray-300 rounded-full dark:bg-slate-700"></div>
            <div className="space-y-2">
              {/* Name Placeholder */}
              <div className="h-5 bg-gray-300 rounded w-40 dark:bg-slate-700"></div>
              {/* Email Placeholder */}
              <div className="h-4 bg-gray-300 rounded w-60 dark:bg-slate-700"></div>
              {/* Type Placeholder */}
              <div className="h-4 bg-gray-300 rounded w-28 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- No User State ---
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4 dark:text-slate-500" />
          <p className="text-gray-500 dark:text-slate-400">No user data available</p>
        </div>
      </div>
    );
  }

  // --- Main User Info Display ---
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <Avatar name={user.name} avatarUrl={user.company.logo} size="lg" className="h-16 w-16 text-lg" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            {/* Name */}
            <h2 className="text-2xl font-bold text-gray-900 truncate dark:text-white">
              {user.name || 'User'}
            </h2>
            
            {/* User Type Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              isCompany 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' 
                : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
            }`}>
              {isCompany ? (
                <>
                  <Building className="h-3 w-3 mr-1" />
                  Company Account
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Job Seeker
                </>
              )}
            </span>
          </div>
          
          {/* Details Section */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
            {/* Email */}
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              <span className="truncate">{user.email}</span>
            </div>
            
            {/* Joined Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              <span>
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {/* Account ID */}
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              <span>Account ID: {user.id.slice(0, 8)}...</span>
            </div>
          </div>
          
          {/* Descriptive Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-slate-500">
              {isCompany ? (
                "Manage your job postings and find the best candidates for your company."
              ) : (
                "Build your professional profile and discover amazing job opportunities."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}