// pages/job-seeker/SavedJobsPage.tsx

import { useMemo, useState } from "react";

import SavedJobCard from "../src/components/common sections/SavedJobCard";
import SavedJobPagination from "../src/components/common sections/SavedJobPagination";

import type { SavedJob } from "@/types/saved-job";
import "./title.css";
type Props = {
  currentUrl: string;
};
import NavigationMenus from "./NavigationMenu";
export default function SavedJobsPage({ currentUrl }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 9;

  // Replace later with API call
  const [savedJobs] = useState<SavedJob[]>([
    {
      id: 1,
      jobId: 101,
      companyName: "Google",
      companyLogo: "https://placehold.co/100x100",
      title: "Frontend Developer",
      salaryFrom: 1000,
      salaryTo: 3000,
      salaryPeriod: "Month",
      jobType: "Internship",
      location: "Singapore",
      postedDate: "01 Jun 2026",
      savedDate: "07 Jun 2026",
    },
  ]);

  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;

    return savedJobs.slice(start, start + jobsPerPage);
  }, [savedJobs, currentPage]);

  const handleView = (jobId: number) => {
    console.log("View", jobId);

    // navigate later
    // navigate(`/jobs/${jobId}`)
  };

  const handleApply = (jobId: number) => {
    console.log("Apply", jobId);
  };

  const handleUnsave = (jobId: number) => {
    console.log("Unsave", jobId);
  };

  return (
    <div className="flex flex-col gap-6">
      <NavigationMenus />
      {/* Row 1 */}
      <h1 className="text-3xl font-bold title-black">Saved Jobs</h1>

      {/* Row 2 */}
      <p className="mt-2 text-muted-foreground">
        Total Jobs Saved: {savedJobs.length}
      </p>

      {/* Row 3 */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {paginatedJobs.map((job) => (
          <SavedJobCard
            key={job.id}
            job={job}
            onView={handleView}
            onApply={handleApply}
            onUnsave={handleUnsave}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <SavedJobPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
