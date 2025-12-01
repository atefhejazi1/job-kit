"use client";

import React from "react";
import JobsList from "./JobsList";

/**
 * Jobs Component - Main component to display jobs on landing page
 * This component fetches and displays the latest jobs from dashboard
 */
const Jobs = () => {
  return (
    <JobsList
      limit={6}
      showMore={true}
      title="Latest Job Openings"
      description="Explore the best job opportunities available from top companies"
    />
  );
};

export default Jobs;
