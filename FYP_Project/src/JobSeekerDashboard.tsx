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
  title: string;
  company: string;
  applicationDate: string;
  status: string;
};

type SavedJob = {
  title: string;
  companyName: string;
  companyLogo: string;
  salary: string;
  type: string;
  location: string;
  postedDate: string;
  savedDate: string;
};

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

  // ---------------------------------------
  // Dummy Applied Jobs
  // ---------------------------------------
  const appliedJobs: AppliedJob[] = Array.from({ length: 12 }).map((_, i) => ({
    title: `Software Engineer ${i + 1}`,
    company: "Google",
    applicationDate: "20 May 2026",
    status: i % 2 === 0 ? "Pending" : "Reviewed",
  }));

  // ---------------------------------------
  // Dummy Saved Jobs
  // ---------------------------------------
  const savedJobs: SavedJob[] = Array.from({ length: 14 }).map((_, i) => ({
    title: `UI/UX Designer ${i + 1}`,
    companyName: "Creative Studio",
    companyLogo: "https://via.placeholder.com/50",
    salary: "$2500 / month",
    type: i % 2 === 0 ? "Full-time" : "Internship",
    location: "Singapore",
    postedDate: "19 May 2026",
    savedDate: "22 May 2026",
  }));

  // ---------------------------------------
  // Pagination
  // ---------------------------------------
  const appliedPerPage = 5;
  const savedPerPage = 6;

  const [appliedPage, setAppliedPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);

  const appliedTotalPages = Math.ceil(appliedJobs.length / appliedPerPage);

  const savedTotalPages = Math.ceil(savedJobs.length / savedPerPage);

  const currentAppliedJobs = appliedJobs.slice(
    (appliedPage - 1) * appliedPerPage,
    appliedPage * appliedPerPage,
  );

  const currentSavedJobs = savedJobs.slice(
    (savedPage - 1) * savedPerPage,
    savedPage * savedPerPage,
  );
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

                  <h2 className="mt-2 text-4xl font-bold title-black">12</h2>
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

                  <h2 className="mt-2 text-4xl font-bold title-black">14</h2>
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
                  {currentAppliedJobs.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-left font-medium">
                        {job.title}
                      </TableCell>

                      <TableCell className="text-left">{job.company}</TableCell>

                      <TableCell className="text-left">
                        {job.applicationDate}
                      </TableCell>

                      <TableCell className="text-left">{job.status}</TableCell>
                    </TableRow>
                  ))}
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

            <Button
              variant="outline"
              onClick={() => navigate("/jobSeeker/savedJobs")}
            >
              View All
            </Button>
          </div>

          {/* SAVED JOB GRID */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentSavedJobs.map((job, index) => (
              <Card key={index} className="hover:shadow-md transition">
                <CardContent className="space-y-4 p-6">
                  {/* ROW 1 */}
                  <div className="flex items-center gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="h-12 w-12 rounded-md object-cover"
                    />

                    <h3 className="font-semibold">{job.title}</h3>
                  </div>

                  {/* ROW 2 */}
                  <p className="text-sm text-muted-foreground text-left">
                    From {job.companyName}
                  </p>

                  {/* ROW 3 */}
                  <p className="font-medium text-left">{job.salary}</p>

                  {/* ROW 4 */}
                  <div className="flex justify-start">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs">
                      {job.type}
                    </span>
                  </div>

                  {/* ROW 5 */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={15} />
                    <span className="text-left">{job.location}</span>
                  </div>

                  {/* ROW 6 */}
                  <p className="text-xs text-muted-foreground text-left">
                    Posted on {job.postedDate}
                  </p>

                  {/* ROW 7 */}
                  <p className="text-xs text-muted-foreground text-left">
                    Saved on {job.savedDate}
                  </p>

                  {/* ROW 8 */}
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" size="icon">
                      <Bookmark className="fill-current" />
                    </Button>

                    <div className="flex gap-2">
                      <Button onClick={() => navigate("/applyjob")}>
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/jobDetails`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PAGINATION */}
          {/* PAGINATION */}
          <div className="flex items-center justify-end gap-2">
            {/* PREVIOUS BUTTON */}
            <Button
              variant="outline"
              size="sm"
              disabled={savedPage === 1}
              onClick={() => setSavedPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-1">
              {Array.from({
                length: savedTotalPages,
              }).map((_, i) => {
                const page = i + 1;

                return (
                  <Button
                    key={page}
                    variant={savedPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSavedPage(page)}
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
              disabled={savedPage === savedTotalPages}
              onClick={() => setSavedPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
