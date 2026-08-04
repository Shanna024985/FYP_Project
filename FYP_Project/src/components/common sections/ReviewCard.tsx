import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Review } from "../../types/review";
import { useNavigate } from "react-router-dom";
type Props = {
  review: Review;
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
};

export default function ReviewCard({ review, onEdit, onDelete }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-4 shadow-sm">
      {/* Company Name */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => navigate(`/company?id=${review.company_id}`)}
          className="text-left text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
        >
          {review.company_name}
        </button>
      </div>

      {/* Rating */}
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

      {/* Review Message */}
      <div className="mb-4 flex-1 text-sm text-muted-foreground">
        {review.message}
      </div>

      {/* Created Date */}
      <div className="mb-4 text-xs text-muted-foreground">
        Reviewed on {new Date(review.created_at).toLocaleDateString()}
      </div>

      {/* Buttons */}
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
