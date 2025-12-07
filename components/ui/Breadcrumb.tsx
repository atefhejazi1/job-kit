"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

// Map route segments to readable labels
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  jobs: "Jobs",
  search: "Search",
  company: "Company",
  user: "User",
  profile: "Profile",
  messages: "Messages",
  applications: "Applications",
  interviews: "Interviews",
  notifications: "Notifications",
  "saved-jobs": "Saved Jobs",
  "saved-companies": "Saved Companies",
  settings: "Settings",
  apply: "Apply",
  login: "Login",
  register: "Register",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showHome = true }) => {
  const pathname = usePathname();

  // Auto-generate breadcrumb items from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    if (!pathname) return [];

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip dynamic segments like [id]
      if (segment.startsWith("[") || segment.match(/^[a-z0-9]{20,}$/i)) {
        breadcrumbs.push({
          label: "Details",
          href: index < segments.length - 1 ? currentPath : undefined,
        });
      } else {
        breadcrumbs.push({
          label:
            routeLabels[segment] ||
            segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " "),
          href: index < segments.length - 1 ? currentPath : undefined,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  if (breadcrumbItems.length === 0 && !showHome) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 text-sm text-gray-600 mb-6 py-3 px-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100"
    >
      {showHome && (
        <>
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          {breadcrumbItems.length > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </>
      )}

      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-orange-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-orange-600 font-medium">{item.label}</span>
          )}
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
