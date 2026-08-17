import {
  FileUserIcon,
  PlusIcon,
  SearchIcon,
  SquarePenIcon,
  Trash,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./components/ui/input-group";
import NavigationMenus from "./NavigationMenu";
import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

import {
  NativeSelect,
  NativeSelectOption,
} from "./components/ui/native-select";
import {  useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import Error from "./Error";
type Props = {
  currentUrl: string;
};
type JobsObject = {
  id: number;
  company_id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  salary_range_from: number;
  salary_range_to: number;
  salary_type: string;
  salary_period: string;
  duration: string;
  deadline: string;
  experience: string;
  career_level: string;
  location: string;
  jobs_needed: number;
  reports: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  company_city: string;
  deleted_at: string;
};
type Company = {
  id: number;
  name: string;
  url: string;
  contact_email: string;
  tagline: string;
  description: string;
  city: string;
  address: string | null;
  logo_url: string;
  banner_url: string | null;
  profile_url: string | null;
  total_jobs: string;
  active_jobs: string;
  active_jobs_list: JobsObject[];
};
const Employer = (props: Props) => {
  if (localStorage.getItem("token") == null) {
    return (
      <Error
        status={403}
        description="You do not have permission to access this page"
        pageLinkForRedirect="/jobSeeker/Dashboard"
        pageForRedirect="home"
      />
    );
  } else {
    return <EmployerPage currentUrl={props.currentUrl} />;
  }
};
function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

let dateChangedToProperReading = (date: string) => {
  let newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.toLocaleString("en-GB", { month: "long" });
  const year = newDate.getFullYear();
  return `${getOrdinal(day)} ${month} ${year}`;
};
type Statuses = {
  status: string;
};
let StatusOfJob = (props: Statuses) => {
  let [options] = useState(["Active", "Closed"]);
  return (
    <>
      {options.map((value) => {
        if (value == props.status) {
          return (
            <NativeSelectOption selected value={value}>
              {value}
            </NativeSelectOption>
          );
        } else {
          return <NativeSelectOption value={value}>{value}</NativeSelectOption>;
        }
      })}
    </>
  );
};
let EmployerPage = (props: Props) => {
  let [dataOfJobs, setDataOfJobs] = useState<JobsObject[]>([]);
  let [toSearchDataOfJobs, setToSearchDataOfJobs] = useState<JobsObject[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(props.currentUrl + "/company/user/companies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((value) => {
        return value.json();
      })
      .then((valueForJobs) => {
        let newDataOfJobs: JobsObject[] = [];
        let jobs: Company[] = valueForJobs.companies;
        jobs.forEach((element) => {
          let jobList: JobsObject[] = element.active_jobs_list;
          let companyId = element.id;
          jobList.forEach((valuesOfJobsForShown) => {
            if (valuesOfJobsForShown.deleted_at === null) {
              newDataOfJobs.push({
                ...valuesOfJobsForShown,
                company_id: companyId,
              });
            }
              setDataOfJobs(newDataOfJobs);
              setToSearchDataOfJobs(newDataOfJobs);
            
          });
        });
      });
  }, []);
  return (
    <>
      <div>
        <NavigationMenus currentUrl={props.currentUrl}/>
        <div className="mt-5 ml-2">
          <p className="text-2xl font-bold text-left">Employer Dashboard</p>
          <hr className="mt-3" />
          <div className="mt-7 flex justify-between">
            <InputGroup className="w-1/3">
              <InputGroupAddon align={"inline-end"}>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search"
                onChange={(e) => {
                  let newDataOfJobs: JobsObject[] = [];

                  toSearchDataOfJobs.forEach((value) => {
                    if (
                      value.title.toLowerCase().includes(e.currentTarget.value)
                    ) {
                      newDataOfJobs.push(value);
                    }
                  });
                  setDataOfJobs(newDataOfJobs);
                }}
              />
            </InputGroup>
            <Button
              className="bg-[#2A88E0]"
              onClick={() => {
                navigate("/jobposting");
              }}
            >
              <PlusIcon /> Add job postings
            </Button>
          </div>
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Job Title</TableHead>
                  <TableHead>Application Deadline</TableHead>
                  <TableHead>Job Type</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-left">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataOfJobs.map((value) => {
                  return (
                    <TableRow>
                      <TableCell className="font-medium text-left">
                        {value.title}
                      </TableCell>
                      <TableCell className="text-left">
                        {dateChangedToProperReading(value.deadline)}
                      </TableCell>
                      <TableCell className="text-left">{value.type}</TableCell>
                      <TableCell className="text-left">
                        <NativeSelect
                          key={value.id}
                          onChange={(e) => {
                            let valueOfInput = e.currentTarget.value;
                            let body = JSON.stringify({
                              status: valueOfInput,
                              companyId: value.company_id,
                            });
                            if (
                              value.status == "Active" 
                            ) {
                              console.log("no")
                              fetch(
                                props.currentUrl +
                                  "/jobs/" +
                                  value.id +
                                  "/close",
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization:
                                      "Bearer " + localStorage.getItem("token"),
                                  },
                                  body: body,
                                },
                              ).then((value) => {
                                if (value.status == 200) {
                                  alert("Job status have been saved");
                                }
                              });
                            } else if (
                              value.status == "Closed" 
                            ) {
                              console.log("yes")
                              fetch(
                                props.currentUrl +
                                  "/jobs/" +
                                  value.id +
                                  "/open",
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization:
                                      "Bearer " + localStorage.getItem("token"),
                                  },
                                  body: body,
                                },
                              ).then((value) => {
                                if (value.status == 200) {
                                  alert("Job status have been saved");
                                }
                              });
                            }
                          }}
                        >
                          <StatusOfJob status={value.status} />
                        </NativeSelect>
                      </TableCell>
                      <TableCell className="text-left">
                        {value.location}
                      </TableCell>
                      <TableCell>
                        <Button
                          className="p-0 bg-white/0 text-left hover:bg-amber-50"
                          onClick={() => {
                            navigate("/jobApplicants?id=" + value.id);
                          }}
                        >
                          <FileUserIcon className="text-black dark:text-white" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          className="p-0 bg-white/0 text-left hover:bg-amber-50"
                          onClick={() => {
                            navigate("/editjobs?id=" + value.id);
                          }}
                        >
                          <SquarePenIcon className="text-black dark:text-white" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          className="p-0 bg-white/0 text-left hover:bg-amber-50"
                          onClick={() => {
                            let body = JSON.stringify({
                              companyId: value.company_id,
                            });
                           
                            fetch(props.currentUrl + "/jobs/" + value.id, {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization:
                                  "Bearer " + localStorage.getItem("token"),
                              },
                              body: body,
                            })
                              .then((valueNotCompatible) => {
                                return valueNotCompatible.json();
                              })
                              .then(() => {
                                toast("Job has been deleted", {
                                  action: {
                                    label: "Undo",
                                    onClick: () => {
                                      fetch(
                                        props.currentUrl +
                                          "/jobs/" +
                                          value.id +
                                          "/restore",
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization:
                                              "Bearer " +
                                              localStorage.getItem("token"),
                                          },
                                          body: body,
                                        },
                                      )
                                        .then((value) => {
                                          return value.json();
                                        })
                                        .then(() => {
                                          let newDataOfJobs: JobsObject[] = [];
                                          dataOfJobs.forEach(
                                            (valueOfExistingData) => {
                                              newDataOfJobs.push(valueOfExistingData)
                                            },
                                          );
                                          setDataOfJobs(newDataOfJobs)
                                        });
                                    },
                                  },
                                  position: "top-center",
                                });
                                let newDataOfJobs: JobsObject[] = [];
                                dataOfJobs.forEach((valueOfExistingData) => {
                                  if (value.id == valueOfExistingData.id) {
                                    return;
                                  } else {
                                    newDataOfJobs.push(valueOfExistingData);
                                  }
                                });
                                setDataOfJobs(newDataOfJobs);
                              });
                          }}
                        >
                          <Trash color="red" className="w-100 h-100" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Employer;
