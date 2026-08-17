import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type BookmarkButtonProps = {
  currentUrl: string;
  jobId: number;
  size?: number;
  className?: string;
};

export default function BookmarkButton({
  currentUrl,
  jobId,
  size = 18,
  className = "",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSaved = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(
          `${currentUrl}/jobs/${jobId}/is-saved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        setBookmarked(data.isSaved);
      } catch (err) {
        console.error(err);
      }
    };

    checkSaved();
  }, [currentUrl, jobId]);

  const handleBookmark = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${currentUrl}/jobs/${jobId}/save`,
        {
          method: bookmarked ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update bookmark.");
      }

      setBookmarked((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("Failed to update bookmark.");
    }
  };

  return (
    <button onClick={handleBookmark} className={className}>
      <Bookmark
        size={size}
        className={
          bookmarked
            ? "fill-black text-black dark:fill-white dark:text-white"
            : "text-muted-foreground dark:text-gray-400"
        }
      />
    </button>
  );
}