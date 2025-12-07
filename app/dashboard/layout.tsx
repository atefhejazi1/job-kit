"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/ui/Avatar";
import CompanyIdChecker from "@/components/auth/CompanyIdChecker";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationDropdown } from "@/components/notifications";
import {
  Award,
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
  Building,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { ResumeProvider } from "@/contexts/ResumeContext";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const { unreadCount } = useUnreadMessages();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".profile-dropdown")) {
        setProfileDropdown(false);
      }
    };

    if (profileDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [profileDropdown]);

  // Get navigation items based on user type
  const navigation = useMemo(() => {
    const baseNav = [
      { name: "Home Page", href: "/", icon: Home },
      { name: "Browse Jobs", href: "/jobs", icon: Briefcase },
    ];

    if (!user) return baseNav;

    if (user.userType === "COMPANY") {
      return [
        ...baseNav,
        {
          name: "Company",
          items: [
            {
              name: "Company Dashboard",
              href: "/dashboard/company",
              icon: Building,
            },
            { name: "Add Job", href: "/dashboard/company/add-job", icon: Plus },
            {
              name: "All Jobs",
              href: "/dashboard/company/all-jobs",
              icon: FileText,
            },
            {
              name: "All Applications",
              href: "/dashboard/company/applications",
              icon: UserCheck,
            },
            {
              name: "Interviews",
              href: "/dashboard/company/interviews",
              icon: Calendar,
            },
            {
              name: "Messages",
              href: "/dashboard/company/messages",
              icon: MessageCircle,
            },
            {
              name: "Company Settings",
              href: "/dashboard/company/settings",
              icon: Settings,
            },
          ],
        },
      ];
    } else {
      return [
        ...baseNav,
        {
          name: "User",
          items: [
            {
              name: "User Dashboard",
              href: "/dashboard/user",
              icon: UserCheck,
            },
            {
              name: "Saved Jobs",
              href: "/dashboard/saved-jobs",
              icon: FileText,
            },
            {
              name: "Resume Builder",
              href: "/dashboard/user/resume-builder",
              icon: FileText,
            },
            {
      name: "Certificates", 
      href: "/dashboard/user/certificates",
      icon: Award,
    },
            {
              name: "Generate Cover Letter ",
              href: "/dashboard/user/cover-letter",
              icon: FileText,
            },
            {
              name: "Job Applications",
              href: "/dashboard/user/applications",
              icon: Briefcase,
            },
            {
              name: "Interviews",
              href: "/dashboard/user/interviews",
              icon: Calendar,
            },
            {
              name: "Messages",
              href: "/dashboard/user/messages",
              icon: MessageCircle,
            },
            {
              name: "User Settings",
              href: "/dashboard/user/settings",
              icon: Settings,
            },
          ],
        },
      ];
    }
  }, [user]);

  const isActive = (href: string) => {
    // Exact match for home page and dashboard
    if (href === "/" || href === "/dashboard") {
      return pathname === href;
    }
    // For other paths, check if current path starts with the href
    return pathname?.startsWith(href) || false;
  };

  return (
    <ProtectedRoute>
      <NotificationProvider>
        <div className="lg:flex bg-gray-50 min-h-screen">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden z-40 fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:shrink-0
      `}
          >
            <div className="flex justify-between items-center px-6 border-gray-200 border-b h-16 shrink-0">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Briefcase className="w-8 h-8 text-primary" />
                <span className="font-bold text-secondary text-xl">JobKit</span>
              </div>
              <button
                className="lg:hidden hover:bg-gray-100 p-2 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-8 px-4 overflow-y-auto">
              <ul className="space-y-6">
                {navigation.map((section) => {
                  if ("items" in section) {
                    // Group section (Company/User)
                    return (
                      <li key={section.name}>
                        <div className="mb-3">
                          <h3 className="px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                            {section.name}
                          </h3>
                        </div>
                        <ul className="space-y-1">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            const isMessagesLink =
                              item.href.includes("/messages");

                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={`
                                flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${
                                  active
                                    ? "bg-primary text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                                }
                              `}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <div className="flex items-center">
                                    <Icon
                                      className={`h-4 w-4 mr-3 ${
                                        active ? "text-white" : "text-gray-500"
                                      }`}
                                    />
                                    {item.name}
                                  </div>
                                  {isMessagesLink && unreadCount > 0 && (
                                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                                      {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                  )}
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
                      <li key={section.name} className="m-0">
                        <Link
                          href={section.href}
                          className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                        ${
                          active
                            ? "bg-primary text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                        }
                      `}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon
                            className={`h-5 w-5 mr-3 ${
                              active ? "text-white" : "text-gray-500"
                            }`}
                          />
                          {section.name}
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            </nav>

            {/* User section */}
            <div className="mt-auto p-4 border-gray-200 border-t shrink-0">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gray-300 rounded-full w-10 h-10"></div>
                    <div>
                      <div className="bg-gray-300 mb-1 rounded w-20 h-4"></div>
                      <div className="bg-gray-300 rounded w-32 h-3"></div>
                    </div>
                  </div>
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar name={user.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {user.email}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          user.userType === "COMPANY"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.userType === "COMPANY" ? "Company" : "Job Seeker"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg w-full text-gray-700 text-sm transition-colors"
                  >
                    <LogOut className="mr-2 w-4 h-4 text-gray-500" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="mb-2 text-gray-500 text-sm">Not logged in</p>
                  <Link
                    href="/auth/login"
                    className="text-primary text-sm hover:underline"
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
            <header className="top-0 z-30 sticky bg-white shadow-sm border-gray-200 border-b">
              <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
                <div className="flex items-center space-x-4">
                  <button
                    className="lg:hidden hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  <div>
                    <h1 className="font-semibold text-gray-900 text-xl">
                      JobKit Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm">
                      Your complete job management platform
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="hidden md:block relative">
                    <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="py-2 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>

                  {/* Notifications */}
                  <NotificationDropdown />

                  {/* Profile */}
                  {user ? (
                    <div className="relative profile-dropdown">
                      <button
                        onClick={() => setProfileDropdown(!profileDropdown)}
                        className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded-lg transition-colors"
                      >
                        <Avatar
                          name={user.name}
                          size="md"
                          className="cursor-pointer"
                        />
                      </button>

                      {/* Profile Dropdown */}
                      {profileDropdown && (
                        <div className="right-0 z-50 absolute bg-white shadow-lg mt-2 py-2 border rounded-md w-48">
                          <div className="px-4 py-2 border-gray-100 border-b">
                            <p className="font-medium text-gray-900 text-sm">
                              {user.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {user.email}
                            </p>
                          </div>
                          <Link href="/dashboard/profile">
                            <button
                              onClick={() =>
                                setProfileDropdown(!profileDropdown)
                              }
                              className="w-full px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <User className="h-4 w-4" />
                              <span>Profile</span>
                            </button>
                          </Link>
                          <button
                            onClick={logout}
                            className="flex items-center space-x-2 hover:bg-red-50 px-4 py-2 w-full text-red-600 text-sm text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center bg-gray-400 rounded-full w-8 h-8">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="p-4 sm:p-6">
              <div className="max-w-7xl mx-auto">
                <Breadcrumb />
                <CompanyIdChecker>
                  <ResumeProvider>{children}</ResumeProvider>
                </CompanyIdChecker>
              </div>
            </main>
          </div>
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
