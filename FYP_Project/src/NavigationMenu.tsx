// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   navigationMenuTriggerStyle,
//   NavigationMenu,
// } from "./components/ui/navigation-menu";
// const NavigationMenus = () => {
//   return (
//     <>
//       <div className="flex w-full justify-between ">
//         <NavigationMenu className="flex justify-between w-screen">
//           <NavigationMenuList>
//             <NavigationMenuItem>
//               <NavigationMenuLink
//                 asChild
//                 className={navigationMenuTriggerStyle()}
//               >
//                 <Link to="/">Microjobs</Link>
//               </NavigationMenuLink>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//         <Link to="/login" className="text-center bg-red-500 rounded-lg p-2.5 text-white font-bold text-sm">
//           Log in with singpass
//         </Link>
//       </div>
//     </>
//   );
// };

// export default NavigationMenus;



import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenu,
} from "./components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

const NavigationMenus = () => {
  const navigate = useNavigate();

  // check login status
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="flex w-full items-center justify-between">
      {/* LEFT SIDE */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/">Microjobs</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* RIGHT SIDE */}
      {!token ? (
        // NOT LOGGED IN
        <Link
          to="/login"
          className="
            font-semibold
            hover:underline
          "
        >
          Login/Register
        </Link>
      ) : (
        // LOGGED IN
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Settings
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>

            {/* TODO: future settings page */}
            {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}

            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default NavigationMenus;