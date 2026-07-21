import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Users,
  CalendarDays,
  MapPin,
} from "lucide-react";
import BookmarkButton from "@/components/common sections/BookmarkButton";
import "./title.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NavigationMenus from "./NavigationMenu";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Job } from "@/types/job";
type Props = {
  currentUrl: string;
};
export default function JobDetailsPage({ currentUrl }: Props) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  useEffect(() => {
    if (!jobId) return;

    const fetchData = async () => {
      try {
        // 1. fetch job
        const jobRes = await axios.get(`${currentUrl}/jobs/${jobId}`);

        const jobData = jobRes.data.job;
        setJob(jobData);

        // 2. fetch company using company_id
        const companyRes = await axios.get(
          `${currentUrl}/company/${jobData.company_id}`,
        );

        setCompany(companyRes.data.company);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);
  if (loading || !job || !company) {
    return <div>Loading...</div>;
  }
  if (!job) return <div>Job not found</div>;
  const careerLevelMap: Record<string, string> = {
    entry: "Entry Level",
    experienced: "Experienced",
    leadership: "Leadership",
    owner: "Director / Owner",
  };
  const createdDate = new Date(job.created_at);
  const updatedDate = new Date(job.updated_at);

  const isUpdated = updatedDate.getTime() > createdDate.getTime();
  const displayDate = isUpdated ? updatedDate : createdDate;
  const label = isUpdated ? "Updated on" : "Posted on";
  const formatSalary = () => {
    const from = job.salary_range_from;
    const to = job.salary_range_to;
    const period = job.salary_period?.toLowerCase();

    if (job.salary_type?.toLowerCase() === "negotiable") {
      return `${from.toLocaleString()} - ${to.toLocaleString()} / ${period} (Negotiable)`;
    }

    if (from && to) {
      if (from === to) {
        return `${from.toLocaleString()} / ${period}`;
      }
      return `${from.toLocaleString()} - ${to.toLocaleString()} / ${period}`;
    }

    return "Not specified";
  };
  return (
    <div className="flex">
      {token && <Sidebar />}
      <div className="flex-1 p-4">
        <NavigationMenus />
        <div className="mx-auto max-w-7xl">
          {/* MAIN CARD */}
          <div className="relative rounded-3xl border bg-background p-8 shadow-sm">
            {/* TOP RIGHT: BOOKMARK */}
            <BookmarkButton
              currentUrl={currentUrl}
              jobId={job.id}
              size={22}
              className="absolute right-6 top-6 transition"
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* LEFT SIDE */}
              <div className="space-y-6 lg:col-span-1">
                {/* LOGO */}
                <div className="flex justify-center rounded-2xl border bg-muted/30 p-6">
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-32 w-32 rounded-2xl object-cover"
                  />
                </div>

                {/* URGENT TAG */}
                {/* <div className="flex justify-center">
                  {job.urgent ? (
                    <Badge className="rounded-full px-4 py-1 text-sm">
                      Urgent Hiring
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-4 py-1 text-sm"
                    >
                      Not Urgent
                    </Badge>
                  )}
                </div> */}

                {/* APPLY BUTTON */}
                <Button
                  className="w-full rounded-xl py-6 text-base"
                  onClick={() => navigate(`/applyjob?id=${job.id}`)}
                >
                  Apply Now
                </Button>

                {/* VIEWS */}
                {/* <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Eye size={16} />
                  <span>{job.views} views</span>
                </div> */}
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-8 lg:col-span-3">
                {/* TITLE */}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight title-black">
                    {job.title}
                  </h1>

                  <p className="mt-2 text-lg text-muted-foreground">
                    From{" "}
                    <Link
                      to={`/company?id=${company.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {company?.name}
                    </Link>
                  </p>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-3">
                  {/* Job Type */}
                  <Badge className="rounded-full px-4 py-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {job.type}
                  </Badge>

                  {/* Category */}
                  <Badge className="rounded-full px-4 py-1 bg-purple-100 text-purple-800 hover:bg-purple-100">
                    {job.category}
                  </Badge>
                </div>

                {/* INFO + SALARY */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* JOB INFO */}
                  <div className="rounded-2xl border bg-muted/20 p-6 lg:col-span-2">
                    <h2 className="mb-5 text-xl font-semibold title-black">
                      Job Info
                    </h2>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3">
                        <Clock3 className="size-4 text-muted-foreground" />
                        <p>
                          <span className="font-medium">Duration:</span>{" "}
                          <span className="text-muted-foreground">
                            {job.duration}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <BriefcaseBusiness className="size-4 text-muted-foreground" />
                        <p>
                          <span className="font-medium">
                            Experience Needed:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {job.experience}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <GraduationCap className="size-4 text-muted-foreground" />
                        <p>
                          <span className="font-medium">Career Level:</span>{" "}
                          <span className="text-muted-foreground">
                            {careerLevelMap[job.career_level] ??
                              job.career_level}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="size-4 text-muted-foreground" />
                        <p>
                          <span className="font-medium">
                            Number of Jobs Left:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {job.jobs_needed}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        <p>
                          <span className="font-medium">Apply Before:</span>{" "}
                          <span className="text-muted-foreground">
                            {new Date(job.deadline).toLocaleDateString("en-SG")}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="size-4 text-muted-foreground" />
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          <span className="text-muted-foreground">
                            {job.address}, {job.location}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SALARY */}
                  <div className="rounded-2xl border bg-muted/20 p-6">
                    <h2 className="mb-4 text-xl font-semibold title-black">
                      Salary
                    </h2>

                    <div className="rounded-2xl bg-background p-5 shadow-sm">
                      <p className="text-lg font-medium">{formatSalary()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* DESCRIPTION */}
                <div>
                  <h2 className="mb-4 text-2xl font-semibold title-black">
                    Job Description
                  </h2>

                  <div className="rounded-2xl border bg-muted/20 p-6 text-left">
                    <p className="leading-8 whitespace-pre-line text-muted-foreground">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* BOTTOM RIGHT */}
                <div className="flex justify-end pt-6">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <p>
                      <span className="font-medium">{label}:</span>{" "}
                      <span className="text-muted-foreground">
                        {displayDate.toLocaleDateString("en-SG")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
