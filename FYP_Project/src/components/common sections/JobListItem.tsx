import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookmarkButton from "./BookmarkButton";

type JobListItemProps = {
  currentUrl: string;
  jobId: number;
  title: string;
  description: string;
  salaryRangeFrom: number;
  salaryRangeTo: number;
  salaryType: string;
  location: string;
  address: string;
  tags: string[];
  date: string;
  companyLogo: string;
  salaryPeriod: string;
};

export default function JobListItem({
  currentUrl,
  jobId,
  title,
  description,
  salaryRangeFrom,
  salaryRangeTo,
  salaryType,
  location,
  address,
  tags,
  date,
  companyLogo,
  salaryPeriod,
}: JobListItemProps) {
  const navigate = useNavigate();
  return (
    <Card className="relative p-4 hover:shadow-md transition">
  {/* Top Row: Logo + Title */}
  <div className="flex items-center gap-4">
    <img
      src={companyLogo}
      className="h-16 w-16 rounded-md object-cover shrink-0"
    />

    <h3 className="text-lg font-semibold">{title}</h3>
  </div>

  {/* Description */}
  <p className="mt-4 text-sm text-muted-foreground line-clamp-3 text-left">
    {description}
  </p>

  {/* Salary + Location */}
  <div className="mt-3 flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground text-center">
    <span>
      {salaryType?.toLowerCase() === "negotiable"
        ? `${salaryRangeFrom} - ${salaryRangeTo} / ${salaryPeriod?.toLowerCase()} (Negotiable)`
        : salaryRangeFrom && salaryRangeTo
          ? salaryRangeFrom === salaryRangeTo
            ? `${salaryRangeFrom} / ${salaryPeriod?.toLowerCase()}`
            : `${salaryRangeFrom} - ${salaryRangeTo} / ${salaryPeriod?.toLowerCase()}`
          : "Not specified"}
    </span>

    <span className="flex items-center gap-1">
      <MapPin size={14} />
      {address}, {location}
    </span>
  </div>

  {/* Tags */}
  <div className="mt-3 flex flex-wrap justify-center gap-2">
    {tags.map((tag) => (
      <span
        key={tag}
        className="rounded-full bg-muted px-2 py-1 text-xs"
      >
        {tag}
      </span>
    ))}
  </div>

  {/* Date */}
  <p className="mt-3 text-xs text-muted-foreground">
    Posted on {date}
  </p>

  {/* Bookmark */}
  <BookmarkButton
    currentUrl={currentUrl}
    jobId={jobId}
    className="absolute top-3 right-3"
  />

  {/* View Button */}
  <div className="absolute bottom-3 right-3">
    <Button
      size="sm"
      onClick={() => navigate(`/jobDetails?id=${jobId}`)}
    >
      View
    </Button>
  </div>
</Card>
  );
}
