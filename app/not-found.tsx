import Link from "next/link";
import { Home, Search, Briefcase, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 leading-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-ping"></div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have gone on a job hunt.
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-medium shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/jobs"
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 font-medium transition-all duration-300 hover:scale-105"
          >
            <Briefcase className="w-5 h-5" />
            Browse Jobs
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/jobs/search"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Job Search
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Find your dream job
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Dashboard
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage applications
                </p>
              </div>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Sign In
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Access your account
                </p>
              </div>
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  Register
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create new account
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Need help? Contact our{" "}
          <a
            href="mailto:support@jobkit.com"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            support team
          </a>
        </p>
      </div>
    </div>
  );
}
