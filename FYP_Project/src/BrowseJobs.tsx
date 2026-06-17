import { useEffect, useState } from "react";

import NavigationMenus from "./NavigationMenu";
import JobFilters from "../src/components/common sections/jobFilters";
import JobListItem from "../src/components/common sections/JobListItem";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { useLocation, useSearchParams } from "react-router-dom";

import type { Job } from "../src/types/job";
type Props = {
  currentUrl: string;
};
export default function BrowseJobs({ currentUrl }: Props) {
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const JOBS_PER_PAGE = 5;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  // FETCH DATA
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const queryString = searchParams.toString();

        const res = await fetch(
          `${currentUrl}/jobs${queryString ? `?${queryString}` : ""}`,
        );

        const data = await res.json();

        setJobs(data.jobs);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentUrl, searchParams]);

  // RESET PAGE WHEN JOBS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [jobs]);

  // PAGINATION
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  // MAP API → UI FORMAT
  const mappedJobs = currentJobs.map((job) => ({
    title: job.title,
    description: job.description,

    salaryRangeFrom: job.salary_range_from,
    salaryRangeTo: job.salary_range_to,
    salaryType: job.salary_type,
    salaryPeriod: job.salary_period,

    location: `${job.location}, ${job.company_city}`,

    tags: [job.type, job.category],

    date: new Date(job.deadline).toLocaleDateString(),

    companyLogo: "https://via.placeholder.com/50",
  }));

  // LOADING / ERROR STATES
  if (loading) return <p className="p-4">Loading jobs...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  return (
    <div className="flex">
      {token && <Sidebar />}
      <div className="flex-1 p-4">
        <NavigationMenus />
        <JobFilters currentUrl={currentUrl} />

        {/* RESULTS */}
        <div className="space-y-4">
          {mappedJobs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No jobs found. Try different filters.
            </div>
          ) : (
            mappedJobs.map((job, i) => (
              <div key={i} className="space-y-4">
                <JobListItem {...job} />
                <div className="h-px bg-border" />
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {/* Previous */}
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          {/* Next */}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
