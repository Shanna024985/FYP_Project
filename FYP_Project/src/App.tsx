import './App.css'
import { Route, Routes } from 'react-router-dom'
import Employer from './employer'
import Homepage from './Homepage'
import JobPostings from './JobPostings'
import EditJobs from './EditJobs'
import ViewApplicants from './ViewApplicants'

const linkForBackend = "http://localhost:3421"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/employer" element={<Employer currentUrl={linkForBackend}/>} />
        <Route path='/jobposting' element={<JobPostings currentUrl={linkForBackend}/>}/>
        <Route path='/editjobs' element={<EditJobs currentUrl={linkForBackend}/>} />
        <Route path='/jobApplicants' element={<ViewApplicants currentUrl={linkForBackend}/>}/>
      </Routes>
    </>
  )
}

export default App