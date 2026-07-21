import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Employer from "./employer";
import Homepage from "./Homepage";
import JobPostings from "./JobPostings";
import EditJobs from "./EditJobs";
import EditCompany from "./EditCompanies";
import ViewApplicants from "./ViewApplicants";
import BrowseJobs from "./BrowseJobs";
import Profile from "./EditProfile";
import JobDetails from "./JobDetails";
import JobSeekerDashboard from "./JobSeekerDashboard";
import JobSeekerApplications from "./JobSeekerApplications";
import LoginPage from "./Login";
import LoginCallbackPage from "./LoginCallback";
import ProtectedLayout from "./ProtectedLayout";
import SavedJobs from "./SavedJobsPage";
import ApplyJobPage from "./ApplyJobPage";
import MyReviewsPage from "./MyReviewsPage";
import JobSeekerRatingsPage from "./JobSeekerRating";
import { CompanyPageRenderer } from "./CompanyPage";
import CompanyReviews from "./CompanyReviews";
import AddCompanies from "./AddCompanies";
import Messages from "./Messages";
const linkForBackend = "https://fyp-project-backend-one.vercel.app/api";
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage currentUrl={linkForBackend} />} />
        <Route path="/browsejobs" element={<BrowseJobs currentUrl={linkForBackend}/>} />
        <Route path="/jobDetails" element={<JobDetails currentUrl={linkForBackend} />} />
        <Route path="/login" element={<LoginPage currentUrl={linkForBackend} />} />
        <Route path="/login/callback" element={<LoginCallbackPage currentUrl={linkForBackend}/>} />
        {/* PROTECTED AREA */}
        <Route element={<ProtectedLayout />}>
          <Route
            path="/employer"
            element={<Employer currentUrl={linkForBackend} />}
          />
          <Route
            path="/jobposting"
            element={<JobPostings currentUrl={linkForBackend} />}
          />
          <Route
            path="/editjobs"
            element={<EditJobs currentUrl={linkForBackend} />}
          />
          <Route
            path="/jobApplicants"
            element={<ViewApplicants currentUrl={linkForBackend} />}
          />
          <Route path="/profile" element={<Profile currentUrl={linkForBackend} />} />
          <Route
            path="/jobSeeker/Dashboard"
            element={<JobSeekerDashboard currentUrl={linkForBackend} />}
          />
          <Route
            path="/jobSeeker/applications"
            element={<JobSeekerApplications currentUrl={linkForBackend} />}
          />
                    <Route path="/company" element={<CompanyPageRenderer  currentUrl={linkForBackend}/>}/>
          <Route path="/companyreviews" element={<CompanyReviews currentUrl={linkForBackend}/>}/>
          <Route path="/addcompanies" element={<AddCompanies currentUrl={linkForBackend}/>}/>
          <Route path="/messages" element={<Messages currentUrl={linkForBackend}/>}/>
          <Route path="/applyjob" element={<ApplyJobPage currentUrl={linkForBackend}/>} />
          <Route path="/editCompany/:id" element={<EditCompany currentUrl={linkForBackend}/>}/>
          <Route
            path="/jobSeeker/savedJobs"
            element={<SavedJobs currentUrl={linkForBackend} />}
          />
          <Route
            path="/jobSeeker/myReviews"
            element={<MyReviewsPage currentUrl={linkForBackend} />}
          />
          <Route
            path="/jobSeeker/ratings"
            element={<JobSeekerRatingsPage currentUrl={linkForBackend} />}
          />
          <Route path="/applyjob" element={<ApplyJobPage currentUrl={linkForBackend}/>} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;


