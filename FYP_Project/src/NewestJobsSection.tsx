import JobCard from "./components/common sections/JobCard";
import './title.css'
type Props = {
  currentUrl: string;
};
export default function NewestJobsSection({ currentUrl }: Props) {
  const dummyJobs = Array.from({ length: 6 }).map((_, i) => ({
    title: `Frontend Developer ${i + 1}`,
    companyName: "Tech Company",
    companyLogo: "https://via.placeholder.com/40",
    salary: "$3000 / month",
    location: "Singapore",
    tags: ["Urgent", "Full-time"],
    postedDate: "21 May 2026",
  }));

  return (
    <section className="mt-10 space-y-6">
      {/* Title */}
      <h2 className="text-center text-2xl font-semibold title-black">
        Newest Jobs
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dummyJobs.map((job, i) => (
          <JobCard key={i} {...job} />
        ))}
      </div>
    </section>
  );
}
