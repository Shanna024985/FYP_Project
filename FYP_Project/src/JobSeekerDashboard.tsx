// JobSeekerDashboard.tsx
import NavigationMenus from "./NavigationMenu";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Bookmark,
  Pencil,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./title.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import JobCard from "@/components/common sections/JobCard";
import JobSeekerRatingsPage from "./JobSeekerRating";
import { useEffect, useState } from "react";
import axios from "axios";

type AppliedJob = {
  id: number;
  job_id: number;
  title: string;
  company_name: string;
  time_applied: string;
  status: string;
};

import type { SavedJob } from "../src/types/saved-job";
import SavedJobCard from "@/components/common sections/SavedJobCard";

type Props = {
  currentUrl: string;
};

export default function JobSeekerDashboard({ currentUrl }: Props) {
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        setLoadingRecommended(true);

        const res = await axios.get(`${currentUrl}/jobs`);

        const sorted = res.data.jobs
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 3);

        setRecommendedJobs(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedJobs();
  }, [currentUrl]);

  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loadingApplied, setLoadingApplied] = useState(true);

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoadingApplied(true);

        const token = localStorage.getItem("token");

        const res = await axios.get(`${currentUrl}/jobs/applications/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppliedJobs(res.data.applications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingApplied(false);
      }
    };

    fetchAppliedJobs();
  }, [currentUrl]);
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoadingSaved(true);

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
          companyLogo: `${currentUrl.replace("/api", "")}/uploads/company-logos/${item.logo_file_name}`,

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
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedJobs();
  }, [currentUrl]);
  // ---------------------------------------
  // Pagination
  // ---------------------------------------
  const appliedPerPage = 5;

  const [appliedPage, setAppliedPage] = useState(1);

  const appliedTotalPages = Math.ceil(appliedJobs.length / appliedPerPage);

  const currentAppliedJobs = appliedJobs.slice(
    (appliedPage - 1) * appliedPerPage,
    appliedPage * appliedPerPage,
  );

  const currentSavedJobs = savedJobs.slice(0, 6);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <NavigationMenus />
      <div className="mx-auto max-w-7xl space-y-10">
        {/* ========================================= */}
        {/* ROW 1 - WELCOME */}
        {/* ========================================= */}
        <div>
          <h1 className="text-3xl font-bold title-black">Welcome!</h1>
          <p className="text-muted-foreground">
            Manage your applications and saved jobs
          </p>
        </div>

        {/* ========================================= */}
        {/* ROW 2 */}
        {/* ========================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* COLUMN 1 - PROFILE PIC */}
          <Card className="flex items-center justify-center p-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="h-40 w-40 rounded-full object-cover"
            />
          </Card>

          {/* COLUMN 2 - USER INFO */}
          <Card className="flex flex-col justify-center p-6">
            <CardContent className="space-y-4 p-0">
              <div>
                {/* Name */}
                <h2 className="text-2xl font-semibold title-black">John Doe</h2>

                {/* Rating */}
                <Button
                  variant="ghost"
                  className="cursor-pointer transition-all hover:bg-primary/10 hover:text-primary hover:scale-105"
                  onClick={() => navigate("/jobSeeker/ratings")}
                >
                  <Badge variant="secondary" className="cursor-pointer">
                    ⭐ 4.8 (25 Reviews)
                    <Eye className="h-4 w-4" />
                  </Badge>
                </Button>
                {/* Email */}
                <p className="text-muted-foreground">johndoe@gmail.com</p>
              </div>
              <Button className="w-fit" onClick={() => navigate("/profile")}>
                <Pencil />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* COLUMN 3 + 4 - STATISTICS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-2">
            {/* JOBS APPLIED */}
            <Card>
              <CardContent className="flex h-full flex-col justify-between space-y-4 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Jobs Applied</p>

                  <h2 className="mt-2 text-4xl font-bold title-black">
                    {appliedJobs.length}
                  </h2>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/jobSeeker/applications")}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* SAVED JOBS */}
            <Card>
              <CardContent className="flex h-full flex-col justify-between space-y-4 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Saved Jobs</p>

                  <h2 className="mt-2 text-4xl font-bold title-black">
                    {savedJobs.length}
                  </h2>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/jobSeeker/savedJobs")}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* REVIEWS */}
            <Card>
              <CardContent className="flex h-full flex-col justify-between space-y-4 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">My Reviews</p>

                  <h2 className="mt-2 text-4xl font-bold title-black">5</h2>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/jobSeeker/myReviews")}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ========================================= */}
        {/* RECOMMENDED JOBS */}
        {/* ========================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold title-black">
              Recommended Jobs
            </h2>
          </div>

          {/* 3 CARDS IN 1 ROW */}
          {loadingRecommended ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  companyName={job.company_name}
                  companyLogo={`data:image/png;base64,AA==`}
                  salaryRangeFrom={job.salary_range_from}
                  salaryRangeTo={job.salary_range_to}
                  salaryType={job.salary_type}
                  salaryPeriod={job.salary_period}
                  location={`${job.location}`}
                  type={job.type}
                  category={job.category}
                  postedDate={new Date(job.created_at).toLocaleDateString(
                    "en-SG",
                  )}
                />
              ))}
            </div>
          )}
        </section>

        {/* ========================================= */}
        {/* JOBS APPLIED */}
        {/* ========================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold title-black">Jobs Applied</h2>

            <Button
              variant="outline"
              onClick={() => navigate("/jobSeeker/applications")}
            >
              View All
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loadingApplied ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : currentAppliedJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8">
                        <div className="flex flex-col items-center gap-4 text-center">
                          <h3 className="text-lg font-semibold">
                            No applications yet
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            You haven't applied for any jobs yet. Browse
                            available jobs and submit your first application.
                          </p>

                          <Button onClick={() => navigate("/browsejobs")}>
                            Browse Jobs
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentAppliedJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="text-left font-medium">
                          {job.title}
                        </TableCell>

                        <TableCell className="text-left">
                          {job.company_name}
                        </TableCell>

                        <TableCell className="text-left">
                          {new Date(job.time_applied).toLocaleDateString(
                            "en-SG",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </TableCell>

                        <TableCell className="text-left">
                          <Badge
                            variant={
                              job.status === "Accepted"
                                ? "default"
                                : job.status === "Rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* PAGINATION */}
          <div className="flex items-center justify-end gap-2">
            {/* PREVIOUS BUTTON */}
            <Button
              variant="outline"
              size="sm"
              disabled={appliedPage === 1}
              onClick={() => setAppliedPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-1">
              {Array.from({
                length: appliedTotalPages,
              }).map((_, i) => {
                const page = i + 1;

                return (
                  <Button
                    key={page}
                    variant={appliedPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAppliedPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            {/* NEXT BUTTON */}
            <Button
              variant="outline"
              size="sm"
              disabled={appliedPage === appliedTotalPages}
              onClick={() => setAppliedPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </section>

        {/* ========================================= */}
        {/* SAVED JOBS */}
        {/* ========================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold title-black">Saved Jobs</h2>

            {savedJobs.length > 0 && (
              <Button
                variant="outline"
                onClick={() => navigate("/jobSeeker/savedJobs")}
              >
                View All
              </Button>
            )}
          </div>

          {savedJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <Bookmark className="h-12 w-12 text-muted-foreground" />

                <div>
                  <h3 className="text-lg font-semibold">No saved jobs yet</h3>
                  <p className="text-muted-foreground">
                    Save jobs you're interested in so you can easily find them
                    later.
                  </p>
                </div>

                <Button onClick={() => navigate("/browsejobs")}>
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {currentSavedJobs.map((job) => (
                <SavedJobCard
                  key={job.id}
                  currentUrl={currentUrl}
                  job={job}
                  onView={(jobId) => navigate(`/jobDetails?id=${jobId}`)}
                  onApply={(jobId) => navigate(`/applyjob?id=${jobId}`)}
                  onUnsave={(removedJob) => {
                    setSavedJobs((prev) =>
                      prev.filter((j) => j.jobId !== removedJob.jobId),
                    );
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
