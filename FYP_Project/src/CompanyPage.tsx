import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import {
  Link,
  Mail,
  MapPin,
  SquareArrowOutUpRightIcon,
  SquareArrowUpRight,
  Star,
  StarHalf,
  StarHalfIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  currentUrl: String;
};
const CompanyPage = (prop: Props) => {
    const navigate = useNavigate();

  return (
    <div>
      <div>
        <img
          src="../public/IMG_0049.JPG"
          alt="banner"
          className="object-cover h-40 w-full rounded-md"
        />
      </div>
      <div className="flex p-5 gap-7">
        <div className="flex items-center justify-center">
          <Avatar className="size-35">
            <AvatarImage src="../public/IMG_0230 copy.jpeg" />
            <AvatarFallback>ProfilePic</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-left flex flex-col">
          <p className="font-bold text-2xl">Green Tea</p>
          <div className="flex flex-col gap-2 mt-2.5">
            <p>Food and Beverage Services</p>

            <a
              href="https://www.google.com/maps/place/34.8915979005778+135.7935469233096"
              target="_blank"
              className="flex gap-2 align-middle text-sm"
            >
              <MapPin className="self-center" /> Uji, Japan
            </a>
            <a href="mailto:" className="flex gap-2 align-middle text-sm">
              <Mail className="self-center " /> example@outlook.com
            </a>
            <a href="greentea.com" className="flex gap-2 align-middle text-sm">
              <Link className="self-center " /> greentea.com
            </a>
          </div>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex-2 flex flex-col gap-5">
          <div className="bg-[#F2E9D9] text-left p-4 rounded-md gap-4 flex-col flex h-fit">
            <p className="font-bold text-2xl">Overview</p>
            <p>
              We sell green tea for everyone to experience a taste of authentic
              Matcha from Japan
            </p>
          </div>

          <div className="bg-[#F2E9D9] text-left p-4 rounded-md gap-4 flex-col  flex h-fit">
            <div className="flex justify-between">
              <div className="text-left w-full flex flex-col gap-2">
                <p className="font-bold text-2xl">Average Rating</p>
                <div className="flex mt-2 gap-3">
                  <p className="text-3xl">4.5</p>
                  <StarIcon className="self-center" fill="yellow" />
                  <StarIcon className="self-center" fill="yellow" />

                  <StarIcon className="self-center" fill="yellow" />

                  <StarIcon className="self-center" fill="yellow" />
                  <StarHalfIcon className="self-center" fill="yellow" />
                </div>
                <p className="text-sm text-gray-400">
                  Average rating on this year performance
                </p>
              </div>

              <div className="text-left w-full flex flex-col gap-2">
                <p className="font-bold text-2xl ">Total Reviews</p>
                <p className="text-3xl">10.0k</p>
                <Button className="w-fit" onClick={(e)=>{
                  navigate("/companyreviews")
                }}>View all reviews</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#F2E9D9] rounded-md text-left p-4">
          <p className="font-bold text-2xl">Job Postings</p>
          <div className="mt-4 flex flex-col gap-4 h-54 overflow-y-scroll">
            <div className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <div className="self-center">
                  <Avatar className="size-17">
                    <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                    <AvatarFallback>ProfilePic</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-bold text-lg">Tea Master</p>
                  <p>Green Tea</p>
                  <p className="text-sm">Fukuoka, Japan</p>
                </div>
              </div>
              <div className="flex">
                <SquareArrowOutUpRightIcon className="self-center justify-end" />
              </div>
            </div>
            <hr className="border-t border-black"/>
            <div className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <div className="self-center">
                  <Avatar className="size-17">
                    <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                    <AvatarFallback>ProfilePic</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-bold text-lg">Tea Master</p>
                  <p>Green Tea</p>
                  <p className="text-sm">Fukuoka, Japan</p>
                </div>
              </div>

              <div className="flex">
                <SquareArrowOutUpRightIcon className="self-center justify-end" />
              </div>
            </div>
            <hr className="border-t border-black"/>
            <div className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <div className="self-center">
                  <Avatar className="size-17">
                    <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                    <AvatarFallback>ProfilePic</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-bold text-lg">Tea Master</p>
                  <p>Green Tea</p>
                  <p className="text-sm">Fukuoka, Japan</p>
                </div>
              </div>

              <div className="flex">
                <SquareArrowOutUpRightIcon className="self-center justify-end" />
              </div>
            </div>
            <hr className="border-t border-black" />
            <div className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <div className="self-center">
                  <Avatar className="size-17">
                    <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                    <AvatarFallback>ProfilePic</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-bold text-lg">Tea Master</p>
                  <p>Green Tea</p>
                  <p className="text-sm">Fukuoka, Japan</p>
                </div>
              </div>

              <div className="flex">
                <SquareArrowOutUpRightIcon className="self-center justify-end" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
