import React from 'react'
import NavigationMenus from "./NavigationMenu";
import JobFilters from "./components/common sections/jobFilters";
import NewestJobsSection from './NewestJobsSection';
import Top3company from './components/common sections/top3company';
const Homepage = () => {
  return (
    <div className="flex flex-col gap-6">
        <NavigationMenus />
        <JobFilters />
        <NewestJobsSection />
        <Top3company />
    </div>
  )
}

export default Homepage