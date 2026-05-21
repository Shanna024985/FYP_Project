import React from "react";
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
const EditJobs = (props: Props) => {
  return (
    <div>
      <NavigationMenus />
      <div className="mt-5 ml-2">
        <p className="text-2xl font-bold text-left">Edit Job</p>
        <FieldGroup className="mt-8">
          <Field>
            <FieldLabel htmlFor="titleName">Job Title</FieldLabel>
            <Input id="titleName" placeholder="Backend Engineer" />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea id="description" placeholder="We need..." />
          </Field>
          <Field>
            <FieldLabel htmlFor="jobTypes">Job Type</FieldLabel>
            <NativeSelect id="jobTypes">
              <NativeSelectOption value={"fullTime"}>
                Full-time
              </NativeSelectOption>
              <NativeSelectOption value={"partTime"}>
                Part-time
              </NativeSelectOption>
              <NativeSelectOption value={"contract"}>
                Contract
              </NativeSelectOption>
              <NativeSelectOption value={"GIG"}>GIG</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="statusDropdown">Status</FieldLabel>
            <NativeSelect id="statusDropdown">
              <NativeSelectOption value={"Active"}>Active</NativeSelectOption>
              <NativeSelectOption value={"Closed"}>Closed</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="locationDropdown">Location</FieldLabel>
            <NativeSelect id="locationDropdown">
              <NativeSelectOption value={"central"}>Central</NativeSelectOption>
              <NativeSelectOption value={"west"}>West</NativeSelectOption>
              <NativeSelectOption value={"east"}>East</NativeSelectOption>
              <NativeSelectOption value={"North"}>North</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="date-optional">
              Application Deadline
            </FieldLabel>
            <DatePickerNaturalLanguage />
          </Field>
          <Field>
            <FieldLabel htmlFor="noofjobs">Number of jobs needed</FieldLabel>
            <Input id="noofjobs" type="number" placeholder="4" />
          </Field>
          <Field>
            <FieldLabel htmlFor="minimumexperience">Career level</FieldLabel>
            <NativeSelect id="minimumexperience">
              <NativeSelectOption value={"early"}>
                Entry Level/Early Career
              </NativeSelectOption>
              <NativeSelectOption value={"experienced"}>
                Experienced Professional
              </NativeSelectOption>
              <NativeSelectOption value={"leadership"}>
                Leadership/Management
              </NativeSelectOption>
              <NativeSelectOption value={"independent"}>
                Independent/Owner
              </NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel>Salary Range</FieldLabel>
            <div className="flex justify-between">
              <Input id="minsalary" className="w-[45%]" placeholder="100" />
              <p className="text-center p-1">to</p>
              <Input id="maxsalary" className="w-[45%]" placeholder="300" />
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
