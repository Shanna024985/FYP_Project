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
  phoneNumber: number;
  email: string;
}
type Props = {
  currentUrl: String;
};
type Status = {
  status: String;
};

function NativeSelectFunction(status: Status) {
  let [optionsForNativeSelect, setoptionsForNativeSelect] = useState([
    { option: "Offer", value: "offer", seleted: false },
    { option: "Interview", value: "interview", seleted: false },
    { option: "Rejected", value: "rejected", seleted: false },
    { option: "Awaiting Replies", value: "waitinglist", seleted: false },
  ]);
  optionsForNativeSelect.forEach((value) => {
    if (value.option == status.status) {
      value.seleted = true;
    }
  });
  return (
    <>
      <NativeSelect
        id="status"
        onChange={(e) => {
          let valueChanged = e.target.value;
          
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

const TabsForApplicant = (props: Props ) => {
  let [dataOfActiveCandidates, setDataOfActiveCandidates] = useState<
    dataOfApplicants[]
  >([
    {
      candidates: "rick",
      time_applied: "new Date()",
      status: "Interview",
      phoneNumber: 24521232,
      email: "testing@example.com",
      resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
    },
    {
      candidates: "ricks",
      time_applied: "new Date()",
      status: "Offer",
      phoneNumber: 24521232,
      email: "testing@example.com",
 resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
    },
  ]);
  let [dataOfAwaitingCandidates, setDataOfAwaitingCandidates] = useState<
    dataOfApplicants[]
  >([
    {
      candidates: "Astergus",
      time_applied: "new Date()",
      status: "Awaiting Replies",
      phoneNumber: 24521232,
      email: "testing@example.com",
    resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
    },
    {
      candidates: "Pearson",
      time_applied: "new Date()",
      status: "Awaiting Replies",
      phoneNumber: 245221232,
      email: "testing@example.com",
 resume: new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
    },
  ]);
  useEffect(()=>{
       let address = new URL(window.location.href);
    let queryParameters = address.searchParams;
    let id = queryParameters.get("id");
    fetch(props.currentUrl + "/jobs/" + id + "/application/overview",{
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
    }).then((value)=>{
      return value.json()
    }).then((thingToWorkWith)=>{
      setDataOfActiveCandidates(thingToWorkWith.activeCandidates)
    })
  },[])
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
                      {value.time_applied}
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
                      <NativeSelectFunction status={value.status} />
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
                return (
                  <TableRow key={index}>
                    <TableCell>{value.candidates}</TableCell>
                    <TableCell>
                      {value.time_applied}
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
                      <NativeSelectFunction status={value.status} />
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
