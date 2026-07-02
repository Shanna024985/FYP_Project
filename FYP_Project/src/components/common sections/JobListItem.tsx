import { Bookmark, MapPin, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type JobListItemProps = {
  jobId: number;
  title: string;
  description: string;
  salaryRangeFrom: number;
  salaryRangeTo: number;
  salaryType: string;
  location: string;
  tags: string[];
  date: string;
  companyLogo: string;
  salaryPeriod: string;
};

export default function JobListItem({
  jobId,
  title,
  description,
  salaryRangeFrom,
  salaryRangeTo,
  salaryType,
  location,
  tags,
  date,
  companyLogo,
  salaryPeriod,
}: JobListItemProps) {
  const [bookmarked, setBookmarked] = useState(false);
  useEffect(() => {
    const checkSaved = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/jobs/${jobId}/is-saved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        setBookmarked(data.isSaved);
      } catch (err) {
        console.error(err);
      }
    };

    checkSaved();
  }, [jobId]);
  const handleBookmark = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/jobs/${jobId}/save`,
        {
          method: bookmarked ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setBookmarked(!bookmarked);
    } catch (error) {
      console.error(error);
      alert("Failed to update bookmark.");
    }
  };
  const navigate = useNavigate();
  return (
    <Card className="relative flex gap-4 p-4 hover:shadow-md transition">
      {/* LEFT: LOGO */}
      <img src={companyLogo} className="h-12 w-12 rounded-md object-cover" />

      {/* RIGHT CONTENT */}
      <div className="flex-1 space-y-2">
        {/* LINE 1: TITLE */}
        <h3 className="font-semibold text-base">{title}</h3>

        {/* LINE 2: DESCRIPTION (3 lines clamp) */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>

        {/* LINE 3: SALARY + LOCATION */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
            {location}
          </span>
        </div>

        {/* LINE 4: TAGS */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted">
              {tag}
            </span>
          ))}
        </div>

        {/* LINE 5: DATE */}
        <p className="text-xs text-muted-foreground">Posted on {date}</p>
      </div>

      {/* TOP RIGHT: BOOKMARK */}
      <button onClick={handleBookmark} className="absolute top-3 right-3">
        <Bookmark
          size={18}
          className={
            bookmarked ? "fill-black text-black" : "text-muted-foreground"
          }
        />
      </button>

      {/* BOTTOM RIGHT: VIEW BUTTON */}
      <div className="absolute bottom-3 right-3">
        <Button size="sm" onClick={() => navigate(`/jobDetails?id=${jobId}`)}>
          View
        </Button>
      </div>
    </Card>
  );
}
