import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  companyName: string;
  description: string;
  salary: string;
  location: string;
  tags: string[];
  date: string;
  companyLogo: string;
};

export default function ApplyJobSelectedCard({
  title,
  companyName,
  description,
  salary,
  location,
  tags,
  date,
  companyLogo,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-3">

        {/* Row 1 */}
        <div className="flex gap-4">
          <img
            src={companyLogo}
            alt={companyName}
            className="h-14 w-14 rounded-md object-cover border"
          />

          <div>
            <h2 className="text-lg font-semibold">
              {title}
            </h2>
          </div>
        </div>

        {/* Row 2 */}
        <p className="text-sm text-muted-foreground">
          From {companyName}
        </p>

        {/* Row 3 */}
        <p className="text-sm line-clamp-3">
          {description}
        </p>

        {/* Row 4 */}
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="font-medium">
            {salary}
          </span>

          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={14} />
            {location}
          </span>
        </div>

        {/* Row 5 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Row 6 */}
        <p className="text-xs text-muted-foreground">
          Posted on {date}
        </p>

      </CardContent>
    </Card>
  );
}