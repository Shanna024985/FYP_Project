import { useState } from "react";

import NavigationMenus from "./NavigationMenu";
import JobFilters from "../src/components/common sections/jobFilters";
import JobListItem from "../src/components/common sections/JobListItem";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
type Props = {
  currentUrl: string;
};
export default function BrowseJobs({ currentUrl }: Props) {
  const token = localStorage.getItem("token");
  const JOBS_PER_PAGE = 5;

  const jobs = Array.from({ length: 20 }).map((_, i) => ({
    title: `Frontend Developer ${i + 1}`,
    description:
      "We are looking for a talented developer to join our team and build modern web applications...",
    salary: "$3000 / month",
    location: "Singapore",
    tags: ["Urgent", "Freelance"],
    date: "22 May 2026",
    companyLogo: "https://via.placeholder.com/50",
  }));

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  return (
    <div className="flex">
      {token && <Sidebar />}
      <div className="flex-1 p-4">
        <NavigationMenus />
        <JobFilters currentUrl={currentUrl} />

        {/* RESULTS */}
        <div className="space-y-4">
          {currentJobs.map((job, i) => (
            <div key={i} className="space-y-4">
              <JobListItem {...job} />
              <div className="h-px bg-border" />
            </div>
          ))}
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
