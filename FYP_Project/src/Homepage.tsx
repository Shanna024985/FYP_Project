import NavigationMenus from "./NavigationMenu";
import JobFilters from "./components/common sections/jobFilters";
import NewestJobsSection from "./NewestJobsSection";
import Sidebar from "./Sidebar";
type Props = {
  currentUrl: string;
};

const Homepage = ({ currentUrl }: Props) => {
  const token = localStorage.getItem("token");

  return (
    <div className="flex min-h-screen">
      {token && <Sidebar />}

      {/* Main Container - Constrained with max-w-7xl and centered with mx-auto */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <NavigationMenus currentUrl={currentUrl}/>
          <JobFilters />
          <NewestJobsSection currentUrl={currentUrl} />
          {/* <Top3company currentUrl={currentUrl} /> */}
        </div>
      </div>
    </div>
  );
};

export default Homepage;