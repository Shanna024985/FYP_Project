import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
type JobCardProps = {
  id: number;
  title: string;
  companyName: string;
  companyLogo: string;
  salary: string;
  location: string;
  tags?: string[];
  postedDate: string;
};

export default function JobCard({
  id,
  title,
  companyName,
  companyLogo,
  salary,
  location,
  tags = [],
  postedDate,
}: JobCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="h-full hover:shadow-md transition">
      {/* ROW 1 */}
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <img
          src={companyLogo}
          alt={companyName}
          className="h-10 w-10 rounded-md object-cover"
        />

        <CardTitle className="text-base leading-tight">{title}</CardTitle>
      </CardHeader>

      {/* ROW 2 - 3 - 4 - 5 - 6 */}
      <CardContent className="space-y-2 text-left">
        {/* Row 2 */}
        <p className="text-sm text-muted-foreground text-left">
          From {companyName}
        </p>

        {/* Row 3 */}
        <p className="font-medium text-sm text-left">{salary}</p>

        {/* Row 4 */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Row 6 */}
        <p className="text-xs text-muted-foreground pt-2">
          Posted on {postedDate}
        </p>
        {/* VIEW BUTTON */}
        <div className="pt-3">
          <Button
            className="w-full"
            onClick={() => navigate(`/jobDetails?id=${id}`)}
          >
            View Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
