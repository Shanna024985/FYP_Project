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
    <div className="flex">
    {token && <Sidebar />}
    <div className="flex-1 p-4">

      <NavigationMenus />
      <JobFilters />
      <NewestJobsSection currentUrl={currentUrl} />
      {/* <Top3company currentUrl={currentUrl} /> */}
    </div>
    </div>
  );
};

export default Homepage;
