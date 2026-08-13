import JobListItem from "./components/common sections/JobListItem";

export default function JobResultsPage() {
  const jobs = Array.from({ length: 5 }).map((_, i) => ({
    currentUrl: "/jobs",
    jobId: i + 1,
    title: `Frontend Developer ${i + 1}`,
    description:
      "We are looking for a talented developer to join our team and build modern web applications using React, TypeScript and Node.js...",
    salaryRangeFrom: 3000,
    salaryRangeTo: 5000,
    salaryType: "Fixed",
    salaryPeriod: "Month",
    location: "Singapore",
    address: "Jurong East",
    tags: ["Urgent", "Freelance"],
    created_date: new Date().toLocaleDateString(),
    updated_date: new Date().toLocaleDateString(),
    companyLogo: "https://via.placeholder.com/50",
  }));

  return (
    <div className="p-6 space-y-4">
      {jobs.map((job, i) => (
        <div key={i} className="space-y-4">
          <JobListItem {...job} />

          {/* separator line */}
          <div className="h-px bg-border" />
        </div>
      ))}
    </div>
  );
}
