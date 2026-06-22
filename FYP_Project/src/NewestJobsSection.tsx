import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./components/common sections/JobCard";
import "./title.css";

type Props = {
  currentUrl: string;
};

export default function NewestJobsSection({ currentUrl }: Props) {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${currentUrl}/jobs`);

        const sorted = res.data.jobs
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 6);

        setJobs(sorted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, [currentUrl]);

  return (
    <section className="mt-10 space-y-6">
      <h2 className="text-center text-2xl font-semibold title-black">
        Newest Jobs
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            companyName={job.company_name}
            companyLogo={`data:image/png;base64,AA==`} // temporary (we fix company next step)
            salaryRangeFrom={job.salary_range_from}
            salaryRangeTo={job.salary_range_to}
            salaryType={job.salary_type}
            salaryPeriod={job.salary_period}
            location={`${job.location}`}
            type={job.type}
            category={job.category}
            postedDate={new Date(job.created_at).toLocaleDateString()}
          />
        ))}
      </div>
    </section>
  );
}
