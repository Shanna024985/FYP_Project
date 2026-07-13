import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
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
import jsPDF from "jspdf";

const doc = new jsPDF();

doc.text("Hello I am Shanna, here are my qualifications...", 10, 10);

const pdfBlob = doc.output("blob");

interface dataOfApplicants {
  candidates: string;
  time_applied: string;
  resume: File;
  status: string;
  phoneNumber: string;
  email: string;
  id: string;
}
interface dataType {
  month: String;
  desktop: number;
}
type Props = {
  currentUrl: String;
  setDataOfCandidates: Function;
  dataOfCandidates: dataType[];
};
type Status = {
  status: String;
  currentUrl: String;
  idOfApplication: string;
  setDataOfCandidates: Function;
  dataOfCandidates: dataType[];
};

function NativeSelectFunction(status: Status) {
  let [optionsForNativeSelect, setoptionsForNativeSelect] = useState([
    { option: "Offer", value: "Offer", seleted: false },
    { option: "Interview", value: "Interview", seleted: false },
    { option: "Rejected", value: "Rejected", seleted: false },
    { option: "Screening", value: "Screening", seleted: false },
    { option: "Reviewing", value: "Reviewing", seleted: false },
  ]);
  let [previousValue, setPreviousValue] = useState(status.status)
  optionsForNativeSelect.forEach((value) => {
    debugger
    if (value.value == status.status) {
      value.seleted = true;
    }
  });
  return (
    <>
      <NativeSelect
        id="status"
        onChange={(e) => {
          let valueChanged = e.currentTarget.value;
         
          let body = JSON.stringify({
            status: valueChanged,
          });
          fetch(
            status.currentUrl + "/jobs/application/" + status.idOfApplication,
            {
              method: "PUT",
              body: body,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            },
          )
            .then((value) => {
              return value.json();
            })
            .then((value) => {
              alert("Successfully updated status");

              let dataOfCandidates = status.dataOfCandidates.map(
                (valuesOfNewArray) => {
                  debugger;
                  console.log(valuesOfNewArray);
                  if (valuesOfNewArray.month == valueChanged) {
                    console.log("done this");
                    return {
                      ...valuesOfNewArray,
                      desktop: valuesOfNewArray.desktop + 1,
                    };
                  } else if (
                    valuesOfNewArray.month == status.status
                  ) {
                    console.log("done that");
                    return {
                      ...valuesOfNewArray,
                      desktop: valuesOfNewArray.desktop - 1,
                    };
                  } else {
                    return valuesOfNewArray;
                  }
                },
              );
                           

              console.log(dataOfCandidates);
              status.setDataOfCandidates(dataOfCandidates);
              setPreviousValue(valueChanged)
            });
        }}
      >
        {optionsForNativeSelect.map((value, index) => {
          return (
            <NativeSelectOption value={value.value} selected={value.seleted}>
              {value.option}
            </NativeSelectOption>
          );
        })}
      </NativeSelect>
    </>
  );
}
type resume = {
  type: string;
  data: string;
};
type activeCandidates = {
  id: string;
  candidate: string;
  time_applied: string;
  resume_file_name: string;
  resume_file_data: resume;
  status: string;
  phone_number: string;
  email: string;
};

function setUpArray(activeCandidates: activeCandidates[]) {
  let thingToSet: dataOfApplicants[] = [];
  activeCandidates.forEach((value) => {
    let resumeBlob = value.resume_file_data;
    let resumeName = value.resume_file_name;
    let resume = new File([resumeBlob.data], resumeName, {
      type: resumeBlob.type,
    });
    let newObj: dataOfApplicants = {
      candidates: value.candidate,
      time_applied: value.time_applied,
      status: value.status,
      phoneNumber: value.phone_number,
      email: value.email,
      resume: resume,
      id: value.id,
    };
    thingToSet.push(newObj);
  });
  return thingToSet;
}

const TabsForApplicant = (props: Props) => {
  let [dataOfActiveCandidates, setDataOfActiveCandidates] = useState<
    dataOfApplicants[]
  >([
    {
      candidates: "rick",
      time_applied: "2026-06-30 01:34:22.791036",
      status: "Interview",
      phoneNumber: "24521232",
      email: "testing@example.com",
      resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
      id: "32",
    },
    {
      candidates: "ricks",
      time_applied: "2026-06-30 01:34:22.791036",
      status: "Offer",
      phoneNumber: "24521232",
      email: "testing@example.com",
      resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
      id: "32",
    },
  ]);
  let [dataOfAwaitingCandidates, setDataOfAwaitingCandidates] = useState<
    dataOfApplicants[]
  >([
    {
      candidates: "Astergus",
      time_applied: "2026-06-30 01:34:22.791036",
      status: "Awaiting Replies",
      phoneNumber: "24521232",
      email: "testing@example.com",
      resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
      id: "32",
    },
    {
      candidates: "Pearson",
      time_applied: "2026-06-30 01:34:22.791036",
      status: "Awaiting Replies",
      phoneNumber: "245221232",
      email: "testing@example.com",
      resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
      id: "32",
    },
  ]);
  useEffect(() => {
    let address = new URL(window.location.href);
    let queryParameters = address.searchParams;
    let id = queryParameters.get("id");
    fetch(props.currentUrl + "/jobs/" + id + "/application/overview", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((value) => {
        return value.json();
      })
      .then((thingToWorkWith) => {
        let activeCandidates: activeCandidates[] =
          thingToWorkWith.activeCandidates;

        let awaitingCandidates: activeCandidates[] =
          thingToWorkWith.awaitingCandidates;
        let thingToSetForActive = setUpArray(activeCandidates);
        setDataOfActiveCandidates(thingToSetForActive);
        let thingToSetForAwait = setUpArray(awaitingCandidates);
        setDataOfAwaitingCandidates(thingToSetForAwait);
      });
  }, []);
  return (
    <div>
      <Tabs defaultValue="active">
        <TabsList variant={"line"}>
          <TabsTrigger value="active">All Active Candidates</TabsTrigger>
          <TabsTrigger value="await">Awaiting Action</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidates</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataOfActiveCandidates.map((value, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{value.candidates}</TableCell>
                    <TableCell>
                      {new Date(value.time_applied).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <a
                        href={URL.createObjectURL(value.resume)}
                        download={value.resume.name}
                        className="text-[#2A88E0]"
                      >
                        {value.resume.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <NativeSelectFunction
                        status={value.status}
                        currentUrl={props.currentUrl}
                        idOfApplication={value.id}
                        dataOfCandidates={props.dataOfCandidates}
                        setDataOfCandidates={props.setDataOfCandidates}
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href={"tel:+65" + value.phoneNumber}
                        className="text-[#2A88E0]"
                      >
                        {value.phoneNumber}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={"mailto:" + value.email}
                        className="text-[#2A88E0]"
                      >
                        {value.email}
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="await">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidates</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataOfAwaitingCandidates.map((value, index) => {
                console.log(value);
                return (
                  <TableRow key={index}>
                    <TableCell>{value.candidates}</TableCell>
                    <TableCell>
                      {new Date(value.time_applied).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <a
                        href={URL.createObjectURL(value.resume)}
                        download={value.resume.name}
                        className="text-[#2A88E0]"
                      >
                        {value.resume.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <NativeSelectFunction
                        status={value.status}
                        currentUrl={props.currentUrl}
                        idOfApplication={value.id}
                        dataOfCandidates={props.dataOfCandidates}
                        setDataOfCandidates={props.setDataOfCandidates}
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href={"tel:+65" + value.phoneNumber}
                        className="text-[#2A88E0]"
                      >
                        {value.phoneNumber}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={"mailto:" + value.email}
                        className="text-[#2A88E0]"
                      >
                        {value.email}
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsForApplicant;
