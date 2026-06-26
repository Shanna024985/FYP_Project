import { useMemo, useState } from "react";

import ReviewCard from "@/components/common sections/ReviewCard";

import { Button } from "@/components/ui/button";

import { mockReviews } from "../src/fakedata/mockReviews";
import './title.css';
import NavigationMenus from "./NavigationMenu";
type Props = {
  currentUrl: string;
};

const REVIEWS_PER_PAGE = 9;

export default function MyReviewsPage({
  currentUrl,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const reviews = mockReviews;

  const totalPages = Math.ceil(
    reviews.length / REVIEWS_PER_PAGE
  );

  const paginatedReviews = useMemo(() => {
    const start =
      (currentPage - 1) * REVIEWS_PER_PAGE;

    const end = start + REVIEWS_PER_PAGE;

    return reviews.slice(start, end);
  }, [currentPage, reviews]);

  const handleEdit = (reviewId: number) => {
    console.log("edit", reviewId);
  };

  const handleDelete = (reviewId: number) => {
    console.log("delete", reviewId);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
        <NavigationMenus />
      {/* Row 1 */}
      <h1 className="mb-2 text-3xl font-bold title-black">
        My Reviews
      </h1>

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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from(
            { length: totalPages },
            (_, index) => (
              <Button
                key={index}
                variant={
                  currentPage === index + 1
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setCurrentPage(index + 1)
                }
              >
                {index + 1}
              </Button>
            )
          )}
        </div>
      )}

      <div className="hidden">
        {currentUrl}
      </div>
    </div>
  );
}