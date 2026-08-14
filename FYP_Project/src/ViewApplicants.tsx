import  { useEffect, useState } from "react";
import NavigationMenus from "./NavigationMenu";
import {  ChartColumnIncreasing } from "lucide-react";
import { ChartBarDefault } from "./BarCharts";
import TabsForApplicant from "./tabsForApplicant";
type Props = {
  currentUrl: string;
};
interface dataType {
  month: String;
  desktop: number;
}
interface dataTypes {
  month: String;
  desktop: string;
}
const ViewApplicants = (props: Props) => {
  let [job, setJobs] = useState("Cashier");
  let [responsesForJob, setResponses] = useState(0);
  let [data, setData] = useState<dataType[]>([
    { month: "Screening", desktop: 186 },
    { month: "Interview", desktop: 305 },
    { month: "Reviewing", desktop: 237 },
    { month: "Offer", desktop: 73 },
    { month: "Onboard", desktop: 209 },
    { month: "Rejected", desktop: 100 },
  ]);

  useEffect(() => {
    let address = new URL(window.location.href);
    let queryParameters = address.searchParams;
    let id = queryParameters.get("id");
    fetch(props.currentUrl + "/jobs/" + id)
      .then((value) => {
        return value.json();
      })
      .then((things) => {
        console.log(things);
        setJobs(things.job.title);
        fetch(props.currentUrl + "/jobs/" + id + "/application/overview", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((value) => {
            return value.json();
          })
          .then((valueToDoCode) => {
            setResponses(valueToDoCode.responses);
            let newDataToSet = valueToDoCode.responseDetails.map((value: dataTypes)=>{
              return {
                ...value,
                desktop: parseInt(value.desktop)
              }
            })
            setData(newDataToSet);
          });
      });
  }, []);
  return (
    <div>
      <NavigationMenus currentUrl={props.currentUrl}/>
      <div className="mt-5 ml-2">
        <p className="text-2xl font-bold text-left">Employer Dashboard</p>
        <hr className="mt-3" />
        <div className="flex mt-5 justify-between">
          <div className="bg-[#2A88E0] text-white p-4 rounded-lg text-left w-[45%] flex flex-col justify-center dark:bg-[#1f5f9b]">
            <ChartColumnIncreasing />
            <div className="mt-2">
              <p className="text-lg">Hello 👋</p>
            </div>
            <div className="mt-1">
              <p className="font-bold text-2xl">
                You have received {responsesForJob} responses for {job}
              </p>
            </div>
          </div>
          <div className="w-[45%] rounded-lg text-left">
            <ChartBarDefault data={data} />
          </div>
        </div>
        <div className="text-left mt-6 p-4 rounded-2xl bg-[#F2E9D9] dark:bg-[#bbab90]">
          <p className="text-2xl font-bold text-left">Candidate List</p>
          <TabsForApplicant currentUrl={props.currentUrl} setDataOfCandidates={setData} dataOfCandidates={data}/>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;
