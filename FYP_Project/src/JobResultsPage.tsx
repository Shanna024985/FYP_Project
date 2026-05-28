import JobListItem from "./components/common sections/JobListItem"

export default function JobResultsPage() {
  const jobs = Array.from({ length: 5 }).map((_, i) => ({
    title: `Frontend Developer ${i + 1}`,
    description:
      "We are looking for a talented developer to join our team and build modern web applications using React, TypeScript and Node.js...",
    salary: "$3000 / month",
    location: "Singapore",
    tags: ["Urgent", "Freelance"],
    date: "22 May 2026",
    companyLogo: "https://via.placeholder.com/50",
  }))

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
  )
}