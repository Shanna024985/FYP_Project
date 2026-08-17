import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import NavigationMenus from "./NavigationMenu";
import { Card, CardContent } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
type ApplicationStatus =
  | "Offer"
  | "Rejected"
  | "Reviewing"
  | "Interview"
  | "Screening";

interface Application {
  id: number;
  job_id: number;
  title: string;
  company_name: string;
  logo_url: string | null;
  resume_file_name: string;
  status: ApplicationStatus;
  time_applied: string;
}

const tabs = [
  "All",
  "Offer",
  "Rejected",
  "Reviewing",
  "Interview",
  "Screening",
] as const;

const ITEMS_PER_PAGE = 9;
type Props = {
  currentUrl: string;
};
export default function MyApplicationsPage({ currentUrl }: Props) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("All");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredApplications = useMemo(() => {
    if (selectedTab === "All") return applications;

    return applications.filter((app) => app.status === selectedTab);
  }, [applications, selectedTab]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${currentUrl}/jobs/applications/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(res.data.applications);
        console.log(res.data.applications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUrl]);
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  if (loading) {
    return (
      <div className="flex justify-center py-10">Loading applications...</div>
    );
  }
  console.log(applications);
  return (
    <div className="flex flex-col gap-6">
      <NavigationMenus currentUrl={currentUrl}/>
      <div className="mx-auto w-[95%] space-y-6">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-3xl font-bold text-black! dark:text-white!">My Applications</h1>
        </div>

        {/* TOTAL APPLICATIONS */}
        <div>
          <p className="text-muted-foreground">
            Total Applications:{" "}
            <span className="font-semibold text-foreground">
              {filteredApplications.length}
            </span>
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center flex-wrap gap-3 w-full">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "default" : "outline"}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* APPLICATION CARDS */}
        {applications.length === 0 ? (
          // Never applied for any jobs
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <BriefcaseBusiness className="h-12 w-12 text-muted-foreground" />

              <div>
                <h3 className="text-lg font-semibold">No applications yet</h3>

                <p className="text-muted-foreground">
                  You haven't applied for any jobs yet. Browse available jobs
                  and submit your first application.
                </p>
              </div>

              <Button onClick={() => navigate("/browsejobs")}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          // Applied before, but none in this tab
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-semibold">
                No {selectedTab.toLowerCase()} applications
              </h3>

              <p className="text-muted-foreground">
                You don't have any {selectedTab.toLowerCase()} applications.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedApplications.map((application) => (
              <Card key={application.id} className="rounded-2xl border">
                <CardContent className="space-y-4 p-6 text-left">
                  {/* Your existing card content */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        application.logo_url || "https://placehold.co/80x80/png"
                      }
                      alt={application.company_name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />

                    <h2 className="text-lg font-semibold text-black! dark:text-white!">
                      {application.title}
                    </h2>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    From{" "}
                    <span className="font-medium text-foreground">
                      {application.company_name}
                    </span>
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Applied on{" "}
                    <span className="text-foreground">
                      {new Date(application.time_applied).toLocaleDateString()}
                    </span>
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Resume used{" "}
                    <span className="text-foreground">
                      {application.resume_file_name}
                    </span>
                  </p>

                  <p className="text-sm">
                    Status{" "}
                    <span
                      className={`font-semibold ${
                        application.status === "Offer"
                          ? "text-green-600"
                          : application.status === "Rejected"
                            ? "text-red-600"
                            : application.status === "Interview"
                              ? "text-blue-600"
                              : application.status === "Screening"
                                ? "text-purple-600"
                                : "text-yellow-600" // Reviewing
                      }`}
                    >
                      {application.status}
                    </span>
                  </p>

                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(`/jobDetails?id=${application.job_id}`)
                    }
                  >
                    View Job
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({
              length: totalPages,
            }).map((_, i) => {
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
        )}
      </div>
    </div>
  );
}
