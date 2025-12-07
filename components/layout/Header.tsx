"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "@/contexts/AuthContext";
import Button from "../ui/Button";
import Link from "next/link";
import { User, Building, LogOut, MessageCircle, Search } from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useUnreadMessages();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.userType === "COMPANY") {
      return "/dashboard/company";
    } else if (user?.userType === "USER") {
      return "/dashboard/user";
    }
    return "/dashboard";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 rounded-lg flex justify-center items-center text-white font-bold text-xl shadow-lg">
                JK
              </div>
              <span className="text-2xl font-bold text-gray-900">JobKit</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-text-primary font-medium transition-colors duration-200 relative group"
            >
              Browse Jobs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-text-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/jobs/search"
              className="flex items-center gap-2 text-gray-600 hover:text-text-primary font-medium transition-colors duration-200 relative group"
            >
              <Search className="w-5 h-5" />
              Advanced Search
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-text-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-gray-600 hover:text-text-primary font-medium transition-colors duration-200 relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-text-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
                <Link
                  href={
                    user?.userType === "COMPANY"
                      ? "/dashboard/company/messages"
                      : "/dashboard/user/messages"
                  }
                  className="relative text-gray-600 hover:text-text-primary transition-colors duration-200 group"
                >
                  <MessageCircle className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </nav>

          {/* User Section */}
          <div className="hidden sm:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.userType === "COMPANY"
                      ? user?.companyName?.charAt(0)?.toUpperCase() || "C"
                      : user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      {user?.userType === "COMPANY"
                        ? user?.companyName
                        : user?.name}
                    </span>
                    <span className="text-xs text-text-primary font-medium">
                      {user?.userType === "COMPANY" ? "Company" : "Job Seeker"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-text-primary hover:to-red-600 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/jobs"
                className="block py-3 px-4 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Browse Jobs
              </Link>
              <Link
                href="/jobs/search"
                className="flex items-center gap-2 py-3 px-4 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Search className="w-5 h-5" />
                Advanced Search
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="block py-3 px-4 text-gray-600 hover:text-text-primary hover:bg-orange-50 rounded-lg transition-colors duration-200"
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
                    className="flex items-center justify-between py-3 px-4 text-gray-600 hover:text-text-primary hover:bg-orange-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Messages
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="py-3 px-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.userType === "COMPANY"
                          ? user?.companyName?.charAt(0)?.toUpperCase() || "C"
                          : user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">
                          {user?.userType === "COMPANY"
                            ? user?.companyName
                            : user?.name}
                        </span>
                        <span className="text-xs text-text-primary font-medium">
                          {user?.userType === "COMPANY"
                            ? "Company"
                            : "Job Seeker"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full py-3 px-4 text-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full py-3 px-4 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-text-primary hover:to-red-600 font-medium shadow-lg transition-all duration-200"
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
