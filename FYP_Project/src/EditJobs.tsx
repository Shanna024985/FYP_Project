import React, { useEffect, useState } from "react";
import NavigationMenus from "./NavigationMenu";
import { Field, FieldGroup, FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "./components/ui/native-select";
import { DatePickerNaturalLanguage } from "./DatePicker";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
type Props = {
  currentUrl: String;
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
};
type Statuses = {
  status?: string;
};
let StatusOfJob = (props: Statuses) => {
  let [options, setOptions] = useState(["Active", "Closed"]);
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
let JobType = (props: Statuses) => {
  let [options, setOptions] = useState([
    "Full-time",
    "Part-Time",
    "Contract",
    "GIG",
  ]);
  return (
    <>
      {options.map((value) => {
        return (
          <NativeSelectOption value={value} selected={value === props.status}>
            {value}
          </NativeSelectOption>
        );
      })}
    </>
  );
};
let LocationOptions = (props: Statuses) => {
  let [options, setOptions] = useState(["Central", "West","East","North"]);
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
let dateReturned = (stringOfDate: string) => {
  if (stringOfDate) {
    let date = new Date(stringOfDate);
    console.log(date.toLocaleString());
    return date;
  }
};
let CareerLevel = (props: Statuses) => {
  let [options, setOptions] = useState([
    {
      value: "entry",
      shownOnPage: "Entry Level/Early Career",
    },
    {
      value: "experienced",
      shownOnPage: "Experienced Professional",
    },
    {
      value: "leadership",
      shownOnPage: "Leadership/Management",
    },
    {
      value: "owner",
      shownOnPage: "Independent/Owner",
    },
  ]);
  return (
    <>
      {options.map((values) => {
        if (props.status) {
          if (values.value == props.status) {
            return (
              <NativeSelectOption selected value={values.value}>
                {values.shownOnPage}
              </NativeSelectOption>
            );
          } else {
            return (
              <NativeSelectOption value={values.value}>{values.shownOnPage}</NativeSelectOption>
            );
          }
        }
      })}
    </>
  );
};
const EditJobs = (props: Props) => {
  let [jobReturned, setJobReturned] = useState<JobsObject>();
  useEffect(() => {
    let address = new URL(window.location.href);
    let queryParameters = address.searchParams;
    let id = queryParameters.get("id");
    fetch(props.currentUrl + "/jobs/" + id)
      .then((value) => {
        return value.json();
      })
      .then((result) => {
        let job = result.job;
        setJobReturned(job);
      });
  }, []);
  return (
    <div>
      <NavigationMenus />
      <div className="mt-5 ml-2">
        <p className="text-2xl font-bold text-left">Edit Job</p>
        <FieldGroup className="mt-8">
          <Field>
            <FieldLabel htmlFor="titleName">Job Title</FieldLabel>
            <Input
              id="titleName"
              placeholder="Backend Engineer"
              value={jobReturned?.title}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="We need..."
              value={jobReturned?.description}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="jobTypes">Job Type</FieldLabel>
            <NativeSelect id="jobTypes">
              <JobType status={jobReturned?.type} />
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="statusDropdown">Status</FieldLabel>
            <NativeSelect id="statusDropdown">
              <StatusOfJob status={jobReturned?.status} />
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="locationDropdown">Location</FieldLabel>
            <NativeSelect id="locationDropdown">
              {/* <NativeSelectOption value={"Central"}>Central</NativeSelectOption>
              <NativeSelectOption value={"West"}>West</NativeSelectOption>
              <NativeSelectOption value={"East"}>East</NativeSelectOption>
              <NativeSelectOption value={"North"}>North</NativeSelectOption> */}
              <LocationOptions status={jobReturned?.location}/>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="date-optional">
              Application Deadline
            </FieldLabel>
            <DatePickerNaturalLanguage
              date={dateReturned(jobReturned?.deadline ?? "")}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="noofjobs">Number of jobs needed</FieldLabel>
            <Input
              id="noofjobs"
              type="number"
              placeholder="4"
              value={jobReturned?.jobs_needed}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="minimumexperience">Career level</FieldLabel>
            <NativeSelect id="minimumexperience">
              <CareerLevel status={jobReturned?.career_level}/>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel>Salary Range</FieldLabel>
            <div className="flex justify-between">
              <Input
                id="minsalary"
                className="w-[45%]"
                placeholder="100"
                value={jobReturned?.salary_range_from}
              />
              <p className="text-center p-1">to</p>
              <Input
                id="maxsalary"
                className="w-[45%]"
                placeholder="300"
                value={jobReturned?.salary_range_to}
              />
            </div>
          </Field>
        </FieldGroup>
        <div className="flex mt-9">
          <Button>Save jobs</Button>
        </div>
      </div>
    </div>
  );
};

export default EditJobs;
