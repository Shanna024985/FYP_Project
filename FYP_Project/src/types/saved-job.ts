export interface SavedJob {
  id: number;
  jobId: number;

  companyName: string;
  companyLogo: string;

  title: string;

  salaryFrom: number;
  salaryTo: number;
  salaryPeriod: string;

  jobType: string;

  location: string;

  postedDate: string;

  savedDate: string;
}