import { useState } from "react";
import {
  Bookmark,
  Eye,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Users,
  CalendarDays,
} from "lucide-react";
import "./title.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NavigationMenus from "./NavigationMenu";
export default function JobDetailsPage() {
  const [bookmarked, setBookmarked] = useState(false);

  // Temporary mock data (replace with backend later)
  const job = {
    title: "Frontend Developer Intern",
    company: "TechNova Solutions",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop",
    urgent: true,
    views: 324,

    tags: ["Internship", "Remote", "Frontend", "React"],

    duration: "1 day",
    experience: "None",
    careerLevel: "Entry Level",
    jobsLeft: 3,
    postedDate: "5th May 2026",
    deadline: "31st May 2026",

    salary: "$1000 / month",

    description: `
We are looking for a passionate Frontend Developer Intern to join our growing team.

Responsibilities:
• Build responsive UI components using React and TypeScript
• Collaborate with backend developers and UI/UX designers
• Optimize pages for performance and accessibility
• Participate in code reviews and testing

Requirements:
• Basic knowledge of React and TypeScript
• Familiar with responsive web design
• Willingness to learn and work in a team
    `,

    updatedAt: "20th May 2026",
  };

  return (
    <div className="flex flex-col gap-6">
        <NavigationMenus />
      <div className="mx-auto max-w-7xl">
        {/* MAIN CARD */}
        <div className="relative rounded-3xl border bg-background p-8 shadow-sm">
          {/* TOP RIGHT: BOOKMARK */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="absolute right-6 top-6 transition"
          >
            <Bookmark
              size={22}
              className={
                bookmarked ? "fill-black text-black" : "text-muted-foreground"
              }
            />
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* LEFT SIDE */}
            <div className="space-y-6 lg:col-span-1">
              {/* LOGO */}
              <div className="flex justify-center rounded-2xl border bg-muted/30 p-6">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="h-32 w-32 rounded-2xl object-cover"
                />
              </div>

              {/* URGENT TAG */}
              <div className="flex justify-center">
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
              </div>

              {/* APPLY BUTTON */}
              <Button className="w-full rounded-xl py-6 text-base">
                Apply Now
              </Button>

              {/* VIEWS */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Eye size={16} />
                <span>{job.views} views</span>
              </div>
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
                  <span className="font-medium text-foreground">
                    {job.company}
                  </span>
                </p>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-3">
                {job.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full px-4 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* INFO + SALARY */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* JOB INFO */}
                <div className="rounded-2xl border bg-muted/20 p-6 lg:col-span-2">
                  <h2 className="mb-5 text-xl font-semibold title-black">Job Info</h2>

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
                        <span className="font-medium">Experience Needed:</span>{" "}
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
                          {job.careerLevel}
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
                          {job.jobsLeft}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      <p>
                        <span className="font-medium">Posted:</span>{" "}
                        <span className="text-muted-foreground">
                          {job.postedDate}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      <p>
                        <span className="font-medium">Apply Before:</span>{" "}
                        <span className="text-muted-foreground">
                          {job.deadline}
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
                    <p className="text-3xl font-bold">{job.salary}</p>
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
              <div className="flex justify-end">
                <p className="text-sm text-muted-foreground">
                  Posted / Updated on {job.updatedAt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
