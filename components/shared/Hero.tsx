"use client";
import Button from "../ui/Button";
import Image from "next/image";
import Link from "next/link";
import Shape from "../ui/shapes/Shape";
import { useTheme } from "@/contexts/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col lg:flex-row items-center gap-12 px-10 py-12 lg:py-20 
      bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
      relative overflow-hidden min-h-[80vh] lg:min-h-[70vh]"
    >
      <div className="flex-1 text-center lg:text-left relative max-w-2xl">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 
          bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight
          dark:from-white dark:via-orange-400 dark:to-red-400"
        >
          Your Complete{" "}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-red-400">
            Job Platform
          </span>{" "}
          for Talent & Opportunity
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl mb-8 sm:mb-10 leading-relaxed">
          <span className="font-semibold text-orange-600 dark:text-orange-400">
            For Job Seekers:
          </span>{" "}
          Build professional resumes and find your dream job.
          <br />
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            For Companies:
          </span>{" "}
          Post jobs and discover top talent effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/register">
            <Button
              variant="primary"
              className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all w-full sm:w-auto"
            >
              Get Started Free
            </Button>
          </Link>

          <Link href="/jobs">
            <button
              className="px-8 py-4 text-lg font-semibold border-2 border-orange-500 text-orange-600 rounded-lg 
              hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-gray-700 transition-all transform hover:scale-105 w-full sm:w-auto"
            >
              Browse Jobs
            </button>
          </Link>

          <Shape
            type="rectangle"
            className="absolute bottom-0 right-10 animate-bounce"
          />
        </div>

        <Shape
          type="square"
          className="absolute top-[-50px] left-10 animate-bounce"
        />

        {/* Background decorative elements */}
        <div
          className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-200 to-red-200 
          rounded-full opacity-20 animate-pulse dark:from-gray-700 dark:to-gray-800"
        ></div>
        <div
          className="absolute top-1/3 -left-8 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-30 animate-bounce dark:from-gray-600 dark:to-gray-700"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
            <span className="text-2xl">💼</span>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                For Job Seekers
              </p>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Create Resume
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
            <span className="text-2xl">🏢</span>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                For Companies
              </p>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Post Jobs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex justify-center items-center">
        <div className="relative max-w-md md:max-w-lg lg:max-w-xl">
          <Image
            src="/hero-image.svg"
            alt="Professional Resume Building"
            width={500}
            height={350}
            className="w-full h-auto object-contain drop-shadow-2xl"
            priority
          />

          {/* Floating elements */}
          <div
            className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 
            rounded-full opacity-80 animate-pulse dark:from-gray-600 dark:to-gray-700"
          ></div>
          <div
            className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-80 animate-bounce dark:from-gray-700 dark:to-gray-800"
            style={{ animationDelay: "1s" }}
          ></div>

          <Shape
            type="square"
            className="absolute bottom-4 right-8 animate-bounce opacity-60"
            size={40}
          />
          <Shape
            type="triangle"
            className="absolute top-4 right-4 animate-bounce opacity-60"
            size={50}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
