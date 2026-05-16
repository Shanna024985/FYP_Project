import { SearchIcon } from "lucide-react";
import { Input } from "./components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./components/ui/input-group";
import NavigationMenus from "./NavigationMenu";

const Employer = () => {
  return (
    <div>
      <NavigationMenus />
      <div className="mt-5 ml-2">
        <p className="text-2xl font-bold text-left">Employer Dashboard</p>
        <hr className="mt-3" />
        <div className="mt-7">
          <InputGroup>
            <InputGroupAddon align={"inline-end"}>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search" />
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Employer;
