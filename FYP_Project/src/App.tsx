// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import { Route, Routes } from 'react-router-dom'
// import Employer from './employer'
// import Homepage from './Homepage'
// import JobPostings from './JobPostings'
// import EditJobs from './EditJobs'
// import ViewApplicants from './ViewApplicants'
// import BrowseJobs from './BrowseJobs'
// import Profile from './EditProfile'
// import JobDetails from './JobDetails'
// import JobSeekerDashboard from './JobSeekerDashboard'
// import JobSeekerApplications from './JobSeekerApplications'
// import LoginPage from './Login'
// import LoginCallbackPage from './LoginCallback'

// const linkForBackend = "http://localhost:3421"

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/employer" element={<Employer currentUrl={linkForBackend}/>} />
//         <Route path='/jobposting' element={<JobPostings currentUrl={linkForBackend}/>}/>
//         <Route path='/editjobs' element={<EditJobs currentUrl={linkForBackend}/>} />
//         <Route path='/jobApplicants' element={<ViewApplicants currentUrl={linkForBackend}/>}/>
//         <Route path='/browsejobs' element={<BrowseJobs />}/>
//         <Route path='/profile' element={<Profile />}/>
//         <Route path='/jobDetails' element={<JobDetails />}/>
//         <Route path='/jobSeeker/Dashboard' element={<JobSeekerDashboard />}/>
//         <Route path='/jobSeeker/applications' element={<JobSeekerApplications />}/>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/login/callback" element={<LoginCallbackPage />} />
//       </Routes>
//     </>
//   )
// }

// export default App

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Employer from "./employer";
import Homepage from "./Homepage";
import JobPostings from "./JobPostings";
import EditJobs from "./EditJobs";
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
const linkForBackend = "http://localhost:3000/api";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage currentUrl={linkForBackend} />} />
        <Route path="/browsejobs" element={<BrowseJobs currentUrl={linkForBackend}/>} />
        <Route path="/jobDetails" element={<JobDetails currentUrl={linkForBackend} />} />
        <Route path="/login" element={<LoginPage currentUrl={linkForBackend} />} />
        <Route path="/login/callback" element={<LoginCallbackPage currentUrl={linkForBackend}/>} />
        <Route path="/applyjob" element={<ApplyJobPage currentUrl={linkForBackend}/>} />
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
          <Route
            path="/jobSeeker/savedJobs"
            element={<SavedJobs currentUrl={linkForBackend} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;


