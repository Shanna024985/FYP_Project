import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import NavigationMenus from "./NavigationMenu";
import { Card, CardContent } from "@/components/ui/card";
import "./title.css";
import { useNavigate } from "react-router-dom";
type ApplicationStatus = "Reviewing" | "Accepted" | "Rejected";

interface Application {
  id: number;
  job: {
    id: number;
    title: string;
  };
  company: {
    name: string;
    logoUrl: string;
  };
  appliedDate: string;
  resumeName: string;
  status: ApplicationStatus;
}

const mockApplications: Application[] = [
  {
    id: 1,
    job: { id: 101, title: "Frontend Developer" },
    company: {
      name: "Google",
      logoUrl: "https://placehold.co/80x80/png",
    },
    appliedDate: "2026-05-20",
    resumeName: "resume.pdf",
    status: "Reviewing",
  },
  {
    id: 2,
    job: { id: 102, title: "Backend Developer" },
    company: {
      name: "Microsoft",
      logoUrl: "https://placehold.co/80x80/png",
    },
    appliedDate: "2026-05-18",
    resumeName: "resume_v2.pdf",
    status: "Accepted",
  },
];

const tabs = ["All", "Reviewing", "Accepted", "Rejected"] as const;

const ITEMS_PER_PAGE = 9;
type Props = {
  currentUrl: string;
};
export default function MyApplicationsPage({ currentUrl }: Props) {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("All");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredApplications = useMemo(() => {
    if (selectedTab === "All") return mockApplications;

    return mockApplications.filter((app) => app.status === selectedTab);
  }, [selectedTab]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-6">
      <NavigationMenus />
      <div className="mx-auto max-w-7xl space-y-6">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-3xl font-bold title-black">My Applications</h1>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedApplications.map((application) => (
            <Card key={application.id} className="rounded-2xl border">
              <CardContent className="space-y-4 p-6 text-left">
                {/* ROW 1: logo + job title */}
                <div className="flex items-center gap-4">
                  <img
                    src={application.company.logoUrl}
                    alt={application.company.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />

                  <h2 className="text-lg font-semibold title-black">
                    {application.job.title}
                  </h2>
                </div>

                {/* ROW 2: company */}
                <p className="text-sm text-muted-foreground">
                  From{" "}
                  <span className="text-foreground font-medium">
                    {application.company.name}
                  </span>
                </p>

                {/* ROW 3: applied date */}
                <p className="text-sm text-muted-foreground">
                  Applied on{" "}
                  <span className="text-foreground">
                    {application.appliedDate}
                  </span>
                </p>

                {/* ROW 4: resume */}
                <p className="text-sm text-muted-foreground">
                  Resume used:{" "}
                  <span className="text-foreground">
                    {application.resumeName}
                  </span>
                </p>

                {/* ROW 5: status */}
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      application.status === "Accepted"
                        ? "text-green-600"
                        : application.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {application.status}
                  </span>
                </p>

                {/* ROW 6: button */}
                <div className="pt-2">
                  <Button className="w-full" onClick={() => navigate(`/jobDetails`)}>
                    View Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
