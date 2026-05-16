import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenu,
} from "./components/ui/navigation-menu";
const NavigationMenus = () => {
  return (
    <>
      <div className="flex w-full justify-between ">
        <NavigationMenu className="flex justify-between w-screen">
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
        <Link to="/employer" className="text-center bg-red-500 rounded-lg p-2.5 text-white font-bold text-sm">
          Log in with singpass
        </Link>
      </div>
    </>
  );
};

export default NavigationMenus;
