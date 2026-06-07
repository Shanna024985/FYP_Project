import { Bookmark, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import type { SavedJob } from "../../types/saved-job";

type Props = {
  job: SavedJob;
  onView: (jobId: number) => void;
  onApply: (jobId: number) => void;
  onUnsave: (jobId: number) => void;
};

export default function SavedJobCard({
  job,
  onView,
  onApply,
  onUnsave,
}: Props) {
  const [isSaved, setIsSaved] = useState(true);
  const handleToggleSave = () => {
    setIsSaved((prev) => !prev);
    onUnsave(job.jobId); // backend later
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
            <Button variant="default" onClick={() => onApply(job.jobId)}>
              Apply Job
            </Button>
            <Button variant="outline" onClick={() => onView(job.jobId)}>
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
