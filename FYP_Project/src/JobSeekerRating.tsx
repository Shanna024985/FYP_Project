import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import './title.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigationMenus from "./NavigationMenu";


type Review = {
  id: number;
  company: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
  employmentPeriod: string;
};

const mockReviews: Review[] = [
  {
    id: 1,
    company: "Google",
    reviewer: "Sarah Tan",
    rating: 5,
    comment: "Excellent communication and very reliable worker.",
    date: "15 May 2026",
    employmentPeriod: "Jan 2026 - Mar 2026",
  },
  {
    id: 2,
    company: "Microsoft",
    reviewer: "David Lim",
    rating: 4,
    comment: "Good performance, slightly slow at times but consistent.",
    date: "10 May 2026",
    employmentPeriod: "Feb 2026 - Apr 2026",
  },
  {
    id: 3,
    company: "Startup SG",
    reviewer: "Emily Wong",
    rating: 5,
    comment: "Very proactive and quick learner.",
    date: "2 May 2026",
    employmentPeriod: "Jan 2026 - Feb 2026",
  },
  {
    id: 4,
    company: "Tech Studio",
    reviewer: "John Lee",
    rating: 3,
    comment: "Average performance, needs improvement in deadlines.",
    date: "28 Apr 2026",
    employmentPeriod: "Dec 2025 - Jan 2026",
  },
];

export default function JobSeekerRatingsPage() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  // ---------------------------
  // FILTERED REVIEWS
  // ---------------------------
  const filteredReviews = useMemo(() => {
    let data = [...mockReviews];

    if (filter !== "all") {
      data = data.filter((r) => r.rating === Number(filter));
    }

    if (sort === "recent") {
      data.sort((a, b) => (a.date < b.date ? 1 : -1));
    }

    if (sort === "highest") {
      data.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "lowest") {
      data.sort((a, b) => a.rating - b.rating);
    }

    return data;
  }, [filter, sort]);

  // ---------------------------
  // STATS
  // ---------------------------
  const avgRating =
    mockReviews.reduce((acc, r) => acc + r.rating, 0) /
    mockReviews.length;

  const ratingCount = (star: number) =>
    mockReviews.filter((r) => r.rating === star).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
        <NavigationMenus />
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold title-black">My Ratings</h1>
        <p className="text-muted-foreground">
          Feedback from employers who worked with you
        </p>
      </div>

      {/* SUMMARY CARD */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 title-black">
                <Star className="text-yellow-500 fill-yellow-500" />
                {avgRating.toFixed(1)} Overall Rating
              </h2>
              <p className="text-muted-foreground">
                {mockReviews.length} Reviews
              </p>
            </div>
          </div>

          {/* DISTRIBUTION */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-12 text-sm">{star} ★</span>

                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${
                        (ratingCount(star) / mockReviews.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <span className="w-6 text-sm text-muted-foreground">
                  {ratingCount(star)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", "5", "4", "3", "2", "1"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : `${f}★`}
            </Button>
          ))}
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* REVIEWS */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{review.company}</h3>

                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>Reviewed by {review.reviewer}</p>
              </div>

              <p className="text-sm">{review.comment}</p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  {review.date}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}