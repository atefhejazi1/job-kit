"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const ProfileBadge = () => {
  const { user } = useAuth();

  if (!user) return null;

  return user.userType === "COMPANY" ? (
    <div className="flex items-center space-x-2 px-3 py-1.5 xl:px-4 xl:py-2 bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-gray-600 rounded-lg">
      {user.company?.logo ? (
        <Image
          src={user.company.logo}
          alt={user.company.name}
          width={40}
          height={20}
          className="rounded"
        />
      ) : (
        <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs xl:text-sm font-bold">
          {user.companyName?.charAt(0)?.toUpperCase() || "C"}
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <span className="text-xs xl:text-sm font-semibold text-gray-800 dark:text-white truncate max-w-[120px] xl:max-w-[150px]">
          {user.companyName}
        </span>
        <span className="text-[10px] xl:text-xs text-orange-600 dark:text-orange-400 font-medium">
          Company
        </span>
      </div>
    </div>
  ) : (
    <div className="flex items-center space-x-2 px-3 py-1.5 xl:px-4 xl:py-2 bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-gray-600 rounded-lg">
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={40}
          height={40}
          className="rounded"
        />
      ) : (
        <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs xl:text-sm font-bold">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <span className="text-xs xl:text-sm font-semibold text-gray-800 dark:text-white truncate max-w-[120px] xl:max-w-[150px]">
          {user.name}
        </span>
        <span className="text-[10px] xl:text-xs text-orange-600 dark:text-orange-400 font-medium">
          Job Seeker
        </span>
      </div>
    </div>
  );
};

export default ProfileBadge;
