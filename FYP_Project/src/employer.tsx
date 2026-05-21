import {
  FileUserIcon,
  PlusIcon,
  SearchIcon,
  SquarePenIcon,
  Trash,
} from "lucide-react";
import { Input } from "./components/ui/input";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  NativeSelect,
  NativeSelectOption,
} from "./components/ui/native-select";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
type Props = {
    currentUrl: String
}

const Employer = (props: Props) => {
  const navigate = useNavigate();
  return (
    <div>
      <NavigationMenus />
      <div className="mt-5 ml-2">
        <p className="text-2xl font-bold text-left">Employer Dashboard</p>
        <hr className="mt-3" />
        <div className="mt-7 flex justify-between">
          <InputGroup className="w-1/3">
            <InputGroupAddon align={"inline-end"}>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search" />
          </InputGroup>
          <Button
            className="bg-[#2A88E0]"
            onClick={() => {
              navigate("/jobposting")
            }}
          >
            <PlusIcon /> Add job postings
          </Button>
        </div>
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Job Title</TableHead>
                <TableHead>Application Deadline</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-left">
                  Backend Engineer
                </TableCell>
                <TableCell className="text-left">20th June 2026</TableCell>
                <TableCell className="text-left">Full-time</TableCell>
                <TableCell className="text-left">
                  <NativeSelect>
                    <NativeSelectOption value={"Active"}>
                      Active
                    </NativeSelectOption>
                    <NativeSelectOption value={"Closed"}>
                      Closed
                    </NativeSelectOption>
                  </NativeSelect>
                </TableCell>
                <TableCell className="text-left">Central</TableCell>
                <TableCell>
                  <Button
                    className="p-0 bg-white/0 text-left"
                    onClick={() => {
                      navigate("/jobApplicants");
                    }}
                  >
                    <FileUserIcon color="black" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    className="p-0 bg-white/0 text-left"
                    onClick={() => {
                      navigate("/editjobs");
                    }}
                  >
                    <SquarePenIcon color="black" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    className="p-0 bg-white/0 text-left"
                    onClick={() =>
                      toast("Job has been deleted", {
                        action: {
                          label: "Undo",
                          onClick: () => console.log("Undo"),
                        },
                        position: "top-center"
                      })
                    }
                  >
                    <Trash color="red" className="w-100 h-100" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default Employer;
