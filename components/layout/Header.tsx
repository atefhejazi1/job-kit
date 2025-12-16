"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Logo from "@/public/logo.svg"
import { User, Building, LogOut, MessageCircle, Search } from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import ThemeToggle from "../shared/ThemeToggle";
import Image from "next/image";
import ProfileBadge from "../shared/ProfileBadge";

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* LOGO */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
             
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                <Image src={Logo} alt="Job Kit" width={90} height={90}/>
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              href="/jobs"
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition"
            >
              Browse Jobs
            </Link>
            <Link
              href="/jobs/search"
              className="flex items-center gap-2 text-gray-600 hover:text-text-primary font-medium transition-colors duration-200 relative group"
            >
              <Search className="w-5 h-5" />
              Advanced Search
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-text-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition"
            >
              About Us
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
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <ThemeToggle />

                {ProfileBadge()}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 xl:space-x-2 px-3 py-1.5 xl:px-4 xl:py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs xl:text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <ThemeToggle />

                <Link
                  href="/login"
                  className="px-3 py-1.5 xl:px-4 xl:py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 xl:px-6 xl:py-2 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-medium shadow-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE/TABLET MENU BUTTON */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE/TABLET MENU */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 transition animate-slideDown">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2">
              <Link
                href="/jobs"
                className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                Browse Jobs
              </Link>
              <Link
                href="/jobs/search"
                className="flex items-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Advanced Search</span>
              </Link>
              <Link
                href="/about"
                className="block py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="block py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition"
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
                    className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Messages</span>
                    </span>

                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 border border-orange-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {user?.userType === "COMPANY"
                          ? user?.companyName?.charAt(0)?.toUpperCase() || "C"
                          : user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white truncate">
                          {user?.userType === "COMPANY"
                            ? user?.companyName
                            : user?.name}
                        </span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {user?.userType === "COMPANY"
                            ? "Company"
                            : "Job Seeker"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    href="/login"
                    className="block w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="block w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-medium transition shadow-lg"
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
