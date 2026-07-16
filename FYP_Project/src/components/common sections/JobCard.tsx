import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import BookmarkButton from "./BookmarkButton";
type JobCardProps = {
  currentUrl: string;
  id: number;
  title: string;
  companyName: string;
  companyLogo: string;
  salaryRangeFrom: number;
  salaryRangeTo: number;
  salaryType: string;
  salaryPeriod: string;
  location: string;
  type: string;
  category: string;
  postedDate: string;
};

export default function JobCard({
  currentUrl,
  id,
  title,
  companyName,
  companyLogo,
  salaryRangeFrom,
  salaryRangeTo,
  salaryType,
  salaryPeriod,
  location,
  type,
  category,
  postedDate,
}: JobCardProps) {
  const navigate = useNavigate();
  const formatSalary = () => {
    const from = Number(salaryRangeFrom);
    const to = Number(salaryRangeTo);
    const period = salaryPeriod?.toLowerCase();

    if (salaryType?.toLowerCase() === "negotiable") {
      return `${from.toLocaleString()} - ${to.toLocaleString()} / ${period} (Negotiable)`;
    }

    if (from && to) {
      if (from === to) {
        return `${from.toLocaleString()} / ${period}`;
      }
      return `${from.toLocaleString()} - ${to.toLocaleString()} / ${period}`;
    }

    return "Not specified";
  };
  return (
    <Card className="h-full hover:shadow-md transition">
      {/* ROW 1 */}
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={companyLogo}
            alt={companyName}
            className="h-10 w-10 rounded-md object-cover"
          />

          <CardTitle className="text-base leading-tight">{title}</CardTitle>
        </div>

        <BookmarkButton currentUrl={currentUrl} jobId={id} />
      </CardHeader>

      {/* ROW 2 - 3 - 4 - 5 - 6 */}
      <CardContent className="space-y-2 text-left">
        {/* Row 2 */}
        <p className="text-sm text-muted-foreground text-left">
          From {companyName}
        </p>

        {/* Row 3 */}
        <p className="font-medium text-sm text-left">{formatSalary()}</p>

        {/* Row 4 */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          <Badge className="rounded-full px-3 py-1 bg-blue-100 text-blue-800">
            {type}
          </Badge>

          <Badge className="rounded-full px-3 py-1 bg-purple-100 text-purple-800">
            {category}
          </Badge>
        </div>

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
