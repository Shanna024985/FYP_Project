import React, { useState } from "react";
import { NavigationMenu } from "./components/ui/navigation-menu";
import NavigationMenus from "./NavigationMenu";
import { ChartBar, ChartColumnIncreasing } from "lucide-react";
import { ChartBarDefault } from "./BarCharts";
import TabsForApplicant from "./tabsForApplicant";
type Props = {
  currentUrl: String;
};
interface dataType {
    month: String,
    desktop: Number
}
const ViewApplicants = (props: Props) => {
  let [job, setJobs] = useState("Cashier");
  let [data, setData] = useState<dataType[]>([
  { month: "Screening", desktop: 186 },
  { month: "Test", desktop: 305 },
  { month: "Interview", desktop: 237 },
  { month: "Offer", desktop: 73 },
  { month: "Onboard", desktop: 209 }
]);
  return (
    <div>
      <NavigationMenus />
      <div className="mt-5 ml-2">
        <p className="text-2xl font-bold text-left">Employer Dashboard</p>
        <hr className="mt-3" />
        <div className="flex mt-5 justify-between">
          <div className="bg-[#2A88E0] text-white p-4 rounded-lg text-left w-[45%] flex flex-col justify-center">
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
          <div className="w-[45%] rounded-lg text-left">
            <ChartBarDefault data={data}/>
          </div>
        </div>
        <div className="text-left mt-6 p-4 rounded-2xl bg-[#F2E9D9]">
          <p className="text-2xl font-bold text-left">Candidate List</p>
          <TabsForApplicant/>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;
