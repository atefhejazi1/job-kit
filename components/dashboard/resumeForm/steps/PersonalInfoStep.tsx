"use client";

import PersonalInfo from "../PersonalInfo";

export default function PersonalInfoStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Personal Information
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Let's start with your basic contact information
        </p>
      </div>
      <PersonalInfo />
    </div>
  );
}
