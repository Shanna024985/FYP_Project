import JobFilters from "../components/JobFilters";
import JobList from "../components/JobList";
import "./BrowseJobs.css";
export default function BrowseJobs() {
  return (
    <div className="browsePage">
      <JobFilters />

      {/* RESULTS BELOW FILTER */}
      <JobList />
    </div>
  );
}