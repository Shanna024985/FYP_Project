import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Review } from "../../types/review";

type Props = {
  review: Review;
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
};

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-4 shadow-sm">
      {/* Row 1 */}
      <div className="mb-3 flex items-center gap-3">
        <img
          src={review.companyLogo}
          alt={review.companyName}
          className="h-12 w-12 rounded-md object-contain"
        />

        <div className="font-semibold">
          {review.companyName}
        </div>
      </div>

      {/* Row 2 */}
      <div className="mb-3 flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className={
              index < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Row 3 */}
      <div className="mb-4 flex-1 text-sm text-muted-foreground">
        {review.description}
      </div>

      {/* Row 4 */}
      <div className="mb-4 text-xs text-muted-foreground">
        {review.updatedAt
          ? `Edited on ${review.updatedAt}`
          : `Reviewed on ${review.createdAt}`}
      </div>

      {/* Row 5 */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onEdit(review.id)}
        >
          Edit Review
        </Button>

        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => onDelete(review.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}