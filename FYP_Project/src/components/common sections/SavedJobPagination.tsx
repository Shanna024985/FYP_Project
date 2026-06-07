import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function SavedJobPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">

      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        Prev
      </Button>

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
              onPageChange(index + 1)
            }
          >
            {index + 1}
          </Button>
        )
      )}

      <Button
        variant="outline"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        Next
      </Button>
    </div>
  );
}