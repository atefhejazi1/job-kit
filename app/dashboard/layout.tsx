'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from '@/components/ui/Avatar';
import { 
  Briefcase, 
  Plus, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  User,
  Bell,
  Search,
  Home,
  UserCheck,
  Building
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  // Get navigation items based on user type
  const navigation = useMemo(() => {
    const baseNav = [
      { name: 'Dashboard', href: '/dashboard', icon: Home }
    ];

    if (!user) return baseNav;

    if (user.userType === 'COMPANY') {
      return [
        ...baseNav,
        { 
          name: 'Company', 
          items: [
            { name: 'Company Dashboard', href: '/dashboard/company', icon: Building },
            { name: 'Add Job', href: '/dashboard/company/add-job', icon: Plus },
            { name: 'All Jobs', href: '/dashboard/company/all-jobs', icon: FileText },
            { name: 'Company Settings', href: '/dashboard/company/settings', icon: Settings },
          ]
        }
      ];
    } else {
      return [
        ...baseNav,
        { 
          name: 'User', 
          items: [
            { name: 'User Dashboard', href: '/dashboard/user', icon: UserCheck },
            { name: 'Resume Builder', href: '/dashboard/user/resume-builder', icon: FileText },
            { name: 'Job Applications', href: '/dashboard/user/applications', icon: Briefcase },
            { name: 'Profile', href: '/dashboard/user/profile', icon: User },
            { name: 'User Settings', href: '/dashboard/user/settings', icon: Settings },
          ]
        }
      ];
    }
  }, [user]);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:shrink-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-secondary">JobKit</span>
          </div>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          <ul className="space-y-6">
            {navigation.map((section) => {
              if ('items' in section) {
                // Group section (Company/User)
                return (
                  <li key={section.name}>
                    <div className="mb-3">
                      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {section.name}
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={`
                                flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${active 
                                  ? 'bg-primary text-white shadow-md' 
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                                }
                              `}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Icon className={`h-4 w-4 mr-3 ${active ? 'text-white' : 'text-gray-500'}`} />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              } else {
                // Single item (Dashboard)
                const Icon = section.icon;
                const active = isActive(section.href);
                
                return (
                  <li key={section.name}>
                    <Link
                      href={section.href}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                        ${active 
                          ? 'bg-primary text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${active ? 'text-white' : 'text-gray-500'}`} />
                      {section.name}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="mt-auto p-4 border-t border-gray-200 shrink-0">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          ) : user ? (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar name={user.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    user.userType === 'COMPANY' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.userType === 'COMPANY' ? 'Company' : 'Job Seeker'}
                  </span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Not logged in</p>
              <Link 
                href="/auth/login"
                className="text-primary hover:underline text-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  JobKit Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Your complete job management platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              {user ? (
                <Avatar name={user.name} size="md" className="cursor-pointer" />
              ) : (
                <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
