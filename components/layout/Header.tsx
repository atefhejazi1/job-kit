"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { LogOut, MessageCircle } from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import ThemeToggle from "../shared/ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useUnreadMessages();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.userType === "COMPANY") return "/dashboard/company";
    if (user?.userType === "USER") return "/dashboard/user";
    return "/dashboard";
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          

          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 rounded-lg flex justify-center items-center text-white font-bold text-xl shadow-lg">
                JK
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                JobKit
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition"
            >
              Browse Jobs
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition"
                >
                  Dashboard
                </Link>

                <Link
                  href={
                    user?.userType === "COMPANY"
                      ? "/dashboard/company/messages"
                      : "/dashboard/user/messages"
                  }
                  className="relative text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
                >
                  <MessageCircle className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                
              </>
            )}
          </nav>

          {/* RIGHT SIDE BUTTONS */}
          <div className="hidden sm:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">

                <div className="flex items-center space-x-3 px-4 py-2 bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-gray-600 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.userType === "COMPANY"
                      ? user?.companyName?.charAt(0)?.toUpperCase() || "C"
                      : user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user?.userType === "COMPANY"
                        ? user?.companyName
                        : user?.name}
                    </span>
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      {user?.userType === "COMPANY" ? "Company" : "Job Seeker"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-medium shadow-lg transition"
                >
                  Sign Up
                </Link>

                <ThemeToggle />
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="sm:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 transition">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/jobs"
                className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                Browse Jobs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href={
                      user?.userType === "COMPANY"
                        ? "/dashboard/company/messages"
                        : "/dashboard/user/messages"
                    }
                    className="flex items-center justify-between py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Messages
                    </span>

                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full py-3 px-4 text-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="block w-full py-3 px-4 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-medium transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
