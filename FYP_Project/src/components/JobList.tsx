import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { mockJobs } from "../data/mockJobs";
import "./JobList.css";

export default function JobList() {
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) =>
      prev.includes(id)
        ? prev.filter((b) => b !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="jobListContainer">
      {mockJobs.map((job) => {
        const isBookmarked = bookmarked.includes(job.id);

        return (
          <div key={job.id} className="jobCard">

            {/* Bookmark */}
            <div
              className="bookmark"
              onClick={() => toggleBookmark(job.id)}
            >
              {isBookmarked ? (
                <BookmarkCheck size={20} />
              ) : (
                <Bookmark size={20} />
              )}
            </div>

            {/* LEFT: LOGO */}
            <img src={job.logo} className="logo" />

            {/* RIGHT CONTENT */}
            <div className="jobContent">

              {/* Title */}
              <h3 className="title">{job.title}</h3>

              {/* Description */}
              <p className="desc">
                {job.description.length > 120
                  ? job.description.slice(0, 120) + "..."
                  : job.description}
              </p>

              {/* Salary + Location */}
              <div className="meta">
                {job.salaryType === "Range"
                  ? `$${job.salaryFrom} - $${job.salaryTo}`
                  : `$${job.salaryFrom}`}{" "}
                / {job.salaryPeriod} • {job.location}
              </div>

              {/* Tags */}
              <div className="tags">
                {job.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="footer">
                <span>Updated: {job.updatedAt}</span>

                <button className="viewBtn">View</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}