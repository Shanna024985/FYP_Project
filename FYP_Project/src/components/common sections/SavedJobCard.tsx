import { Bookmark, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import type { SavedJob } from "../../types/saved-job";

type Props = {
  currentUrl: string;
  job: SavedJob;
  onView: (jobId: number) => void;
  onApply: (jobId: number) => void;
  onUnsave: (job: SavedJob) => void;
};

export default function SavedJobCard({
  currentUrl,
  job,
  onUnsave,
}: Props) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(true);

  const handleToggleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${currentUrl}/jobs/${job.jobId}/save`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unsave job.");
      }

      // Only update after success
      setIsSaved(false);
      onUnsave(job);
    } catch (err) {
      console.error(err);
      alert("Failed to unsave job.");
    }
  };
  return (
    <Card className="h-full">
      <CardContent className="space-y-3 text-left">
        {/* Row 1 */}
        <div className="flex items-center gap-3">
          <img
            src={job.companyLogo}
            alt={job.companyName}
            className="h-12 w-12 rounded-md object-cover border"
          />

          <div>
            <h3 className="font-semibold">{job.title}</h3>
          </div>
        </div>

        {/* Row 2 */}
        <p className="text-muted-foreground">From {job.companyName}</p>

        {/* Row 3 */}
        <p>
          ${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()}{" "}
          per {job.salaryPeriod.toLowerCase()}
        </p>

        {/* Row 4 */}
        <p>{job.jobType}</p>

        {/* Row 5 */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>

        {/* Row 6 */}
        <p>Posted on {job.postedDate}</p>

        {/* Row 7 */}
        <p>Saved on {job.savedDate}</p>

        <div className="flex w-full items-center justify-between pt-2">
          {/* Left side - bookmark */}
          <Button variant="ghost" size="icon" onClick={handleToggleSave}>
            <Bookmark
              className={
                isSaved ? "fill-black text-black" : "text-muted-foreground"
              }
            />
          </Button>

          {/* Right side - actions */}
          <div className="flex gap-2">
            <Button variant="default" onClick={() => navigate(`/applyjob`)}>
              Apply Job
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/jobDetails?id=${job.jobId}`)}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
