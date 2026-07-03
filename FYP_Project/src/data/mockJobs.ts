export type Job = {
  id: number;
  title: string;
  description: string;
  salaryFrom: number;
  salaryTo: number;
  salaryType: "Negotiable" | "Fixed" | "Range";
  salaryPeriod: "Month" | "Year" | "Hour";
  location: string;
  tags: string[];
  updatedAt: string;
  companyName: string;
  logo: string;
};

export const mockJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description:
      "Build modern web applications using React. Work closely with designers and backend engineers to deliver high quality UI.",
    salaryFrom: 3000,
    salaryTo: 5000,
    salaryType: "Range",
    salaryPeriod: "Month",
    location: "Singapore",
    tags: ["Full-time", "Urgent"],
    updatedAt: "2026-05-10",
    companyName: "TechCorp",
    logo: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    description:
      "Design clean and user-friendly interfaces for mobile and web applications.",
    salaryFrom: 3500,
    salaryTo: 3500,
    salaryType: "Fixed",
    salaryPeriod: "Month",
    location: "Remote",
    tags: ["Freelance"],
    updatedAt: "2026-05-08",
    companyName: "Designify",
    logo: "https://via.placeholder.com/50",
  },
];