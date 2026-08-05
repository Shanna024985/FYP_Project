import { useEffect, useMemo, useState } from "react";
import type { Review } from "./types/review";
import ReviewCard from "@/components/common sections/ReviewCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {StarIcon} from "lucide-react";

import { Button } from "@/components/ui/button";

import "./title.css";
import NavigationMenus from "./NavigationMenu";
type Props = {
  currentUrl: string;
};

const REVIEWS_PER_PAGE = 9;

export default function MyReviewsPage({ currentUrl }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${currentUrl}/reviews/user/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();

        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [currentUrl]);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editMessage, setEditMessage] = useState("");

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;

    const end = start + REVIEWS_PER_PAGE;

    return reviews.slice(start, end);
  }, [currentPage, reviews]);

  const handleEdit = (reviewId: number) => {
    const review = reviews.find((r) => r.id === reviewId);

    if (!review) return;

    setEditReview(review);
    setEditRating(review.rating);
    setEditMessage(review.message);
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Delete this review?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${currentUrl}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Unable to delete review.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <NavigationMenus currentUrl={currentUrl} />
      {/* Row 1 */}
      <h1 className="mb-2 text-3xl font-bold title-black">My Reviews</h1>

      {/* Row 2 */}
      <p className="mb-8 text-muted-foreground">
        Total Reviews: {reviews.length}
      </p>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {paginatedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        <Dialog
          open={!!editReview}
          onOpenChange={(open) => {
            if (!open) setEditReview(null);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="title-black">Edit Review</DialogTitle>
              <DialogDescription>Update your review.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <Label>Rating</Label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className="cursor-pointer"
                    fill={star <= editRating ? "yellow" : "white"}
                    onClick={() => setEditRating(star)}
                  />
                ))}
              </div>

              <Input
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                onClick={async () => {
                  if (!editReview) return;

                  try {
                    const token = localStorage.getItem("token");

                    const response = await fetch(
                      `${currentUrl}/reviews/${editReview.id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          rating: editRating,
                          message: editMessage,
                        }),
                      },
                    );

                    if (!response.ok) {
                      throw new Error("Failed to update");
                    }

                    setReviews((prev) =>
                      prev.map((review) =>
                        review.id === editReview.id
                          ? {
                              ...review,
                              rating: editRating,
                              message: editMessage,
                            }
                          : review,
                      ),
                    );

                    setEditReview(null);
                  } catch (err) {
                    console.error(err);
                    alert("Unable to update review.");
                  }
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}

      <div className="hidden">{currentUrl}</div>
    </div>
  );
}
