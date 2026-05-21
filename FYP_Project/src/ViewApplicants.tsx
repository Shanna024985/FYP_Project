import React, { useState } from "react";
import { NavigationMenu } from "./components/ui/navigation-menu";
import NavigationMenus from "./NavigationMenu";
import { ChartBar, ChartColumnIncreasing } from "lucide-react";
type Props = {
  currentUrl: String;
};
const ViewApplicants = (props: Props) => {
  let [job, setJobs] = useState("Cashier");
  return (
    <div>
      <NavigationMenus />
      <div className="mt-5 ml-2">
        <p className="text-2xl font-bold text-left">Employer Dashboard</p>
        <hr className="mt-3" />
        <div className="flex mt-5 justify-between">
          <div className="bg-[#2A88E0] text-white p-4 rounded-lg text-left w-[45%]">
            <ChartColumnIncreasing />
            <div className="mt-2">
              <p className="text-lg">Hello 👋</p>
            </div>
            <div className="mt-1">
              <p className="font-bold text-2xl">
                You have received 350 responses for {job}
              </p>
            </div>
          </div>
          <div className="bg-[#F2E9D9] w-[45%] rounded-lg p-4 text-left">
            <p className="font-bold text-2xl">Candidate Per Stage</p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;
