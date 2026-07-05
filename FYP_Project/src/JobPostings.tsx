import React, { useEffect, useState } from "react";
import NavigationMenus from "./NavigationMenu";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./components/ui/field";
import { Input } from "./components/ui/input";
import { DatePickerNaturalLanguage } from "./DatePicker";

import {
  NativeSelect,
  NativeSelectOption,
} from "./components/ui/native-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
type Props = {
  currentUrl: String;
};
type stages = {
  stage: Number;
  setStage: Function;
  currentUrl: String;
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
};
const StepOneOfJobPostings = (props: stages) => {
  let [itemsForCompanySelect, setItemsForCompanySelect] = useState<string[]>([
    "Birds", "Apple","tea",
  ]);
  useEffect(() => {
    fetch(props.currentUrl + "/company/user/companies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((value)=>{
      return value.json()
    }).then((values)=>{
      let companysarray: Company[] = values.companies 
      let newArray: string[]= []
      if (companysarray){
        companysarray.forEach(element => {
          newArray.push(element.name)
        });
      }
      setItemsForCompanySelect(newArray)
    })
  }, []);
  return (
    <>
      <div>
        <FieldGroup className="mt-8">
          <Field>
            <FieldLabel htmlFor="titleName">Job Title</FieldLabel>
            <Input required id="titleName" placeholder="Backend Engineer" />
          </Field>
          <Field>
            <FieldLabel htmlFor="jobTypes">Job Type</FieldLabel>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"fullTime"}>Full-time</SelectItem>
                  <SelectItem value={"partTime"}>Part-time</SelectItem>
                  <SelectItem value={"contract"}>Contract</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="jobTypes">Job Category</FieldLabel>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"admin"}>Admin & Secretarial</SelectItem>
                  <SelectItem value={"business"}>Business & Finance</SelectItem>
                  <SelectItem value={"engineering"}>Engineering</SelectItem>
                  <SelectItem value={"customersupport"}>
                    Customer Support
                  </SelectItem>
                  <SelectItem value={"it"}>IT & Software</SelectItem>
                  <SelectItem value="design">Design & Creatives</SelectItem>
                  <SelectItem value="education">
                    Education & Training
                  </SelectItem>
                  <SelectItem value="science">Healthcare & Science</SelectItem>
                  <SelectItem value="security">Legal & Security</SelectItem>
                  <SelectItem value="transportation">
                    Logistics & Transportation
                  </SelectItem>
                  <SelectItem value="marketing">
                    Marketing & Advertising
                  </SelectItem>
                  <SelectItem value="parttimer">
                    Part-time & Freelance
                  </SelectItem>
                  <SelectItem value="sales">Sales & Retail</SelectItem>
                  <SelectItem value="trading">Trades & Services</SelectItem>
                  <SelectItem value="writing">Writing & Translation</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="">Company</FieldLabel>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectItem value={"birds"}>Birds</SelectItem>
                  <SelectItem value={"apple"}>Apple</SelectItem>
                  <SelectItem value={"tealive"}>Tealive</SelectItem> */}
                  {
                    itemsForCompanySelect.map((valuesOfCompany)=>{
                      return (
                      <>
                      <SelectItem value={valuesOfCompany}>{valuesOfCompany}</SelectItem>
                      </>)
                    })
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              Click{" "}
              <a href="/addcompanies" className="text-[#2A88E0]">
                here
              </a>{" "}
              to add a company
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="noofjobs">Number of Jobs Positions</FieldLabel>
            <Input required id="noofjobs" type="number" placeholder="4" />
          </Field>
        </FieldGroup>
      </div>
      <div
        className="flex"
        onClick={(e) => {
          props.setStage(2);
        }}
      >
        <Button className="mt-10">Next</Button>
      </div>
    </>
  );
};

const StepTwoOfJobPostings = (props: stages) => {
  return (
    <>
      <div>
        <FieldGroup className="mt-8">
          <Field>
            <FieldLabel>Salary Range</FieldLabel>
            <div className="flex justify-between">
              <Input id="minsalary" className="w-[45%]" placeholder="100" />
              <p className="text-center p-1">to</p>
              <Input id="maxsalary" className="w-[45%]" placeholder="300" />
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="date-optional">
              Application Deadline
            </FieldLabel>
            <DatePickerNaturalLanguage />
          </Field>
          <Field>
            <FieldLabel htmlFor="preferredDuration">
              Preferred Duration
            </FieldLabel>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"sevendays"}>1 Week</SelectItem>
                  <SelectItem value={"thirtydays"}>1 Month</SelectItem>
                  <SelectItem value={"sixmonth"}>6 Months</SelectItem>
                  <SelectItem value={"oneyear"}>1 Year</SelectItem>
                  <SelectItem value={"greaterthanoneyear"}>
                    More than 1 year
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </div>
      <div
        className="flex"
        onClick={(e) => {
          props.setStage(3);
        }}
      >
        <Button className="mt-10">Next</Button>
      </div>
    </>
  );
};

const StepThreeOfJobPostings = (props: stages) => {
  let [cities, setCities] = React.useState({
    Singapore: ["Singapore"],

    Japan: ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Sapporo", "Fukuoka"],

    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu"],

    China: [
      "Beijing",
      "Shanghai",
      "Guangzhou",
      "Shenzhen",
      "Chengdu",
      "Hangzhou",
    ],

    India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"],

    Thailand: ["Bangkok", "Chiang Mai", "Phuket"],

    Malaysia: ["Kuala Lumpur", "George Town", "Johor Bahru"],

    Indonesia: ["Jakarta", "Surabaya", "Bandung", "Denpasar"],

    Vietnam: ["Ho Chi Minh City", "Hanoi", "Da Nang"],

    "United Kingdom": [
      "London",
      "Manchester",
      "Birmingham",
      "Edinburgh",
      "Glasgow",
    ],

    France: ["Paris", "Lyon", "Marseille", "Nice"],

    Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],

    Italy: ["Rome", "Milan", "Naples", "Florence", "Venice"],

    Spain: ["Madrid", "Barcelona", "Valencia", "Seville"],

    Netherlands: ["Amsterdam", "Rotterdam", "The Hague"],

    "United States": [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "San Francisco",
      "Seattle",
      "Miami",
      "Boston",
    ],

    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],

    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],

    "New Zealand": ["Auckland", "Wellington", "Christchurch"],

    "United Arab Emirates": ["Dubai", "Abu Dhabi"],

    "South Africa": ["Cape Town", "Johannesburg", "Durban"],

    Brazil: ["São Paulo", "Rio de Janeiro", "Brasília"],

    Mexico: ["Mexico City", "Guadalajara", "Monterrey"],
  });
  return (
    <>
      <div>
        <FieldGroup className="mt-8">
          <Field>
            <FieldLabel htmlFor="minimumexperience">Career level</FieldLabel>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"early"}>
                    Entry Level/Early Career
                  </SelectItem>
                  <SelectItem value={"experienced"}>
                    Experienced Professional
                  </SelectItem>
                  <SelectItem value={"leadership"}>
                    Leadership/Management
                  </SelectItem>
                  <SelectItem value={"independent"}>
                    Independent/Owner
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="locationDropdown">Location</FieldLabel>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(cities).map(([country, citiesLoop]) => {
                    return (
                      <>
                        <React.Fragment key={country}>
                          <SelectLabel>{country}</SelectLabel>
                          {citiesLoop.map((city) => (
                            <SelectItem
                              key={city}
                              value={city.toLowerCase().replace(/\s+/g, "-")}
                            >
                              {city}
                            </SelectItem>
                          ))}
                        </React.Fragment>
                      </>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <div className="flex" onClick={(e) => {}}>
          <Button className="mt-10">Save</Button>
        </div>
      </div>
    </>
  );
};

export const Tick = () => {
  return (
    <svg
      className="self-center"
      xmlns="http://www.w3.org/2000/svg"
      width="103"
      height="103"
      viewBox="0 0 103 103"
      fill="none"
    >
      <circle cx="51.5" cy="51.5" r="51.5" fill="#53DA47" />
      <path
        d="M73.8332 34.75L43.1248 65.4583L29.1665 51.5"
        stroke="black"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const ConditionalRenderer = (props: stages) => {
  if (props.stage == 1) {
    return (
      <StepOneOfJobPostings
        setStage={props.setStage}
        stage={props.stage}
        currentUrl={props.currentUrl}
      />
    );
  } else if (props.stage == 2) {
    return (
      <StepTwoOfJobPostings
        setStage={props.setStage}
        stage={props.stage}
        currentUrl={props.currentUrl}
      />
    );
  } else if (props.stage == 3) {
    return (
      <StepThreeOfJobPostings
        setStage={props.setStage}
        stage={props.stage}
        currentUrl={props.currentUrl}
      />
    );
  }
};
const JobPostings = (props: Props) => {
  let [stage, setStage] = useState(1);
  useEffect(() => {
    console.log(stage);
    if (stage == 2) {
      let step1SvgDiv = document.getElementById("step1SVG");
      let step2SvgDiv = document.getElementById("step2SVG");
      if (step1SvgDiv) {
        let paragraph = document.getElementById("paragraphOfJobOverview");
        if (paragraph) {
          paragraph.classList.replace("text-[#2A88E0]", "text-[#000000]");
        }
      }
      if (step2SvgDiv) {
        let p = document.getElementById("paragraphOfPayTerms");
        if (p) {
          p.classList.replace("text-[#B0B0B0]", "text-[#2A88E0]");
          let circleSVG = document.getElementById("circleOfStep2");
          if (circleSVG) {
            circleSVG.setAttribute("fill", "#2A88E0");
          }
        }
      }
    } else if (stage == 3) {
      let step2SvgDiv = document.getElementById("step2SVG");
      let step3SvgDiv = document.getElementById("step3SVGDiv");
      if (step2SvgDiv) {
        let p = document.getElementById("paragraphOfPayTerms");
        if (p) {
          p.classList.replace("text-[#2A88E0]", "text-[#000000]");
        }
      }
      if (step3SvgDiv) {
        let circle = document.getElementById("step3SVGCircle");
        if (circle) {
          circle.setAttribute("fill", "#2A88E0");
          let p = document.getElementById("paragraphOfJobRequirements");
          if (p) {
            p.classList.replace("text-[#B0B0B0]", "text-[#2A88E0]");
          }
        }
      }
    }
  }, [stage]);
  return (
    <div>
      <NavigationMenus />
      <div className="mt-10 p-5 flex gap-5 justify-center">
        <div className="flex flex-col gap-2 justify-center" id="step1SVG">
          {stage >= 2 ? (
            <Tick />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="103"
              height="103"
              viewBox="0 0 103 103"
              fill="none"
              className="self-center"
            >
              <circle cx="51.5" cy="51.5" r="51.5" fill="#2A88E0" />
              <path
                d="M51.144 75V38.328L41.352 43.704L39.048 39.352L52.424 32.248H56.584V75H51.144Z"
                fill="white"
              />
            </svg>
          )}

          <p
            className="text-left text-[#2A88E0] font-bold self-center"
            id="paragraphOfJobOverview"
          >
            Job Overview
          </p>
        </div>
        <div className="self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="235"
            height="1"
            viewBox="0 0 235 1"
            fill="none"
          >
            <path
              d="M0.5 0.5H234.5"
              stroke="black"
              stroke-opacity="0.4"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-2 justify-center" id="step2SVG">
          {stage <= 2 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="103"
              height="103"
              viewBox="0 0 103 103"
              fill="none"
            >
              <circle
                cx="51.5"
                cy="51.5"
                r="51.5"
                fill="#B0B0B0"
                id="circleOfStep2"
              />
              <path
                d="M38.328 75V70.456L57.016 52.856C58.3813 51.576 59.3627 50.296 59.96 49.016C60.5573 47.736 60.856 46.4773 60.856 45.24C60.856 43.4053 60.4507 41.8267 59.64 40.504C58.872 39.1387 57.8053 38.072 56.44 37.304C55.0747 36.536 53.4747 36.152 51.64 36.152C49.848 36.152 48.0987 36.6 46.392 37.496C44.6853 38.3493 42.744 39.672 40.568 41.464L38.328 37.432C40.504 35.384 42.68 33.912 44.856 33.016C47.0747 32.0773 49.4 31.608 51.832 31.608C54.648 31.608 57.1653 32.1627 59.384 33.272C61.6027 34.3813 63.3307 35.96 64.568 38.008C65.848 40.056 66.488 42.4667 66.488 45.24C66.488 46.9467 66.0187 48.696 65.08 50.488C64.184 52.2373 62.6053 54.1787 60.344 56.312L45.368 70.456H67.128V75H38.328Z"
                fill="white"
              />
            </svg>
          ) : (
            <Tick />
          )}
          <p
            className="text-left font-bold text-[#B0B0B0] self-center"
            id="paragraphOfPayTerms"
          >
            Pay Terms
          </p>
        </div>
        <div className="self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="235"
            height="1"
            viewBox="0 0 235 1"
            fill="none"
          >
            <path
              d="M0.5 0.5H234.5"
              stroke="black"
              stroke-opacity="0.4"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-2 justify-center" id="step3SVGDiv">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="103"
            viewBox="0 0 103 103"
            fill="none"
            className="self-center"
          >
            <circle
              cx="51.5"
              cy="51.5"
              r="51.5"
              fill="#B0B0B0"
              id="step3SVGCircle"
            />
            <path
              d="M50.792 75.64C47.848 75.64 45.224 75.192 42.92 74.296C40.616 73.3573 38.4187 71.864 36.328 69.816L38.568 65.784C40.616 67.6613 42.6853 69.0267 44.776 69.88C46.8667 70.6907 48.872 71.096 50.792 71.096C53.7787 71.096 56.1893 70.3707 58.024 68.92C59.8587 67.4693 60.776 65.528 60.776 63.096C60.776 60.664 59.8587 58.744 58.024 57.336C56.1893 55.8853 53.7787 55.16 50.792 55.16H45.736V50.808H50.792C53.48 50.808 55.6987 50.1893 57.448 48.952C59.24 47.7147 60.136 45.9013 60.136 43.512C60.136 41.1227 59.24 39.3093 57.448 38.072C55.6987 36.792 53.48 36.152 50.792 36.152C48.872 36.152 46.9733 36.5787 45.096 37.432C43.2187 38.2427 41.256 39.5867 39.208 41.464L36.968 37.432C39.0587 35.384 41.192 33.912 43.368 33.016C45.5867 32.0773 48.0613 31.608 50.792 31.608C53.7787 31.608 56.3813 32.12 58.6 33.144C60.8613 34.1253 62.6107 35.4907 63.848 37.24C65.128 38.9467 65.768 40.9093 65.768 43.128C65.768 45.4747 65.0213 47.5227 63.528 49.272C62.0347 50.9787 59.9867 52.216 57.384 52.984C60.2 53.752 62.3973 55.0533 63.976 56.888C65.5973 58.7227 66.408 60.92 66.408 63.48C66.408 65.8267 65.768 67.9173 64.488 69.752C63.208 71.5867 61.3947 73.0373 59.048 74.104C56.744 75.128 53.992 75.64 50.792 75.64Z"
              fill="white"
            />
          </svg>
          <p
            className="text-left font-bold text-[#B0B0B0] self-center"
            id="paragraphOfJobRequirements"
          >
            Job Requirements
          </p>
        </div>
      </div>
      <div id="questions">
        <ConditionalRenderer
          stage={stage}
          setStage={setStage}
          currentUrl={props.currentUrl}
        />
      </div>
    </div>
  );
};

export default JobPostings;
