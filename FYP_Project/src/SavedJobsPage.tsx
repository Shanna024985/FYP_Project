// pages/job-seeker/SavedJobsPage.tsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
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

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${currentUrl}/jobs/saved/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const jobs: SavedJob[] = res.data.saved_jobs.map((item: any) => ({
          id: item.id,
          jobId: item.job_id,

          companyName: item.company_name,
          companyLogo: `http://localhost:3000/uploads/company-logos/${item.logo_file_name}`,

          title: item.title,

          salaryFrom: item.salary_range_from,
          salaryTo: item.salary_range_to,
          salaryPeriod: item.salary_period,

          jobType: item.type,

          location: item.location,

          postedDate: new Date(item.posted_date).toLocaleDateString("en-SG", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),

          savedDate: new Date(item.created_at).toLocaleDateString("en-SG", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));

        setSavedJobs(jobs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedJobs();
  }, [currentUrl]);

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

  const handleUnsave = (removedJob: SavedJob) => {
    setSavedJobs((prev) =>
      prev.filter((job) => job.jobId !== removedJob.jobId),
    );

    toast("Removed from Saved Jobs", {
      action: {
        label: "Undo",
        onClick: async () => {
          const token = localStorage.getItem("token");

          await fetch(`${currentUrl}/jobs/${removedJob.jobId}/save`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setSavedJobs((prev) => [removedJob, ...prev]);
        },
      },
    });
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
            currentUrl={currentUrl}
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
