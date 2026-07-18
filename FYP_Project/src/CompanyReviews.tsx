import React, { useEffect, useState } from "react";
import { Plus, StarHalfIcon, StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./components/ui/label";
type Props = {
  currentUrl: String;
};
type Reviews = {
  id: string;
  company_id: string;
  user_id: string;
  rating: number;
  message: string;
  created_at: string;
  username: string;
};
type Stars = {
  averageRating: number;
};
let StarsPage = (prop: Stars) => {
  const stars = [];
  let previousNumber = 0;
  for (let i = 1; i <= 5; i++) {
    if (prop.averageRating >= i) {
      stars.push(<StarIcon className="self-center" fill="yellow" key={i} />);
      previousNumber = i;
    } else if (prop.averageRating < i && prop.averageRating > previousNumber) {
      stars.push(
        <StarHalfIcon className="self-center" fill="yellow" key={i} />,
      );
      previousNumber = i;
    }
  }
  return stars;
};
const CompanyReviews = (prop: Props) => {
  const [rating, setRating] = useState(0);
  let [dataOfReviews, setDataOfReviews] = useState<Reviews[]>([]);
  useEffect(() => {
    let address = new URL(window.location.href);
    let queryParameters = address.searchParams;
    let id = queryParameters.get("id");
    fetch(prop.currentUrl + "/reviews/company/" + id)
      .then((valueCannnotUse) => {
        return valueCannnotUse.json();
      })
      .then((values) => {
        setDataOfReviews(values.reviews);
      });
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <p className="text-left text-3xl font-semibold">Reviews</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="self-center">
              <Plus /> Add reviews
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="!text-black">Add reviews</DialogTitle>
              <DialogDescription>
                Help others learn what it’s like to work at this company by
                sharing your experience
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className="size-7"
                      fill={star <= rating ? "yellow" : "white"}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <Input
                  id="link"
                  placeholder="The company culture is great!..."
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" onClick={(e) => {}}>
                  Submit
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <hr className="mt-4 " />
      <div className="flex mt-4 gap-10 w-full h-full items-center">
        <div className="text-left flex flex-col gap-2 align-middle h-full justify-center ">
          <p className="text-lg">Total Reviews</p>
          <p className="font-semibold text-2xl ">10.0k</p>
        </div>
        <div className="text-left  flex flex-col gap-2 h-full ">
          <p className="text-lg">Average Rating</p>
          <div className="flex gap-3">
            <p className="font-semibold text-2xl">4.5</p>
            <StarsPage averageRating={4.5} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-3">
            <StarIcon className="self-center" fill="yellow" />
            <p className="font-semibold">5</p>
            <div className="bg-green-700 rounded-2xl w-60"></div>
            <p className="font-semibold">2.0k</p>
          </div>
          <div className="flex gap-3">
            <StarIcon className="self-center" fill="yellow" />
            <p className="font-semibold">4</p>
            <div className="bg-[#00739D] rounded-2xl w-40"></div>
            <p className="font-semibold">1.6k</p>
          </div>
          <div className="flex gap-3">
            <StarIcon className="self-center" fill="yellow" />
            <p className="font-semibold">3</p>
            <div className="bg-amber-300 rounded-2xl w-20"></div>
            <p className="font-semibold">400</p>
          </div>
          <div className="flex gap-3">
            <StarIcon className="self-center" fill="yellow" />
            <p className="font-semibold">2</p>
            <div className="bg-[#66009D] rounded-2xl w-10"></div>
            <p className="font-semibold">200</p>
          </div>
          <div className="flex gap-3">
            <StarIcon className="self-center" fill="yellow" />
            <p className="font-semibold">1</p>
            <div className="bg-[#9D0000] rounded-2xl w-4"></div>
            <p className="font-semibold">16</p>
          </div>
        </div>
      </div>
      <hr className="mt-4 " />
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex p-5 gap-7 align-middle">
          <div className="flex items-center justify-center">
            <Avatar className="size-20">
              <AvatarImage src="../public/IMG_0230 copy.jpeg" />
              <AvatarFallback>ProfilePic</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left flex flex-col align-middle h-full">
            <p className="font-bold text-2xl">Green Tea</p>
            <div className="flex flex-col gap-2 mt-2.5">
              <p>24-10-2026</p>
            </div>
          </div>
          <div className="mt-1 flex flex-col gap-4">
            <div className="flex gap-3">
              <StarsPage averageRating={4.5} />
            </div>
            <p className="text-left">
              My first job in this company went well it was very fruitful and
              the company culture is great
            </p>
          </div>
        </div>
        <hr className="mx-4" />
        <div className="flex p-5 gap-7 align-middle">
          <div className="flex items-center justify-center">
            <Avatar className="size-20">
              <AvatarImage src="../public/IMG_0230 copy.jpeg" />
              <AvatarFallback>ProfilePic</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left flex flex-col align-middle h-full">
            <p className="font-bold text-2xl">Green Tea</p>
            <div className="flex flex-col gap-2 mt-2.5">
              <p>24-10-2026</p>
            </div>
          </div>
          <div className="mt-1 flex flex-col gap-4">
            <div className="flex gap-3">
              <StarsPage averageRating={4.5} />
            </div>
            <p className="text-left">
              My first job in this company went well it was very fruitful and
              the company culture is great
            </p>
          </div>
        </div>
        <hr className="mx-4" />
        {dataOfReviews.map((value) => {
          return (
            <>
              <div className="flex p-5 gap-7 align-middle">
                <div className="flex items-center justify-center">
                  <Avatar className="size-20">
                    <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                    <AvatarFallback>ProfilePic</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-left flex flex-col align-middle h-full">
                  <p className="font-bold text-2xl">{value.username}</p>
                  <div className="flex flex-col gap-2 mt-2.5">
                    <p>{new Date(value.created_at).toDateString()}</p>
                  </div>
                </div>
                <div className="mt-1 flex flex-col gap-4">
                  <div className="flex gap-3">
                    <StarsPage averageRating={value.rating} />
                  </div>
                  <p className="text-left">
                    {value.message}
                  </p>
                </div>
              </div>
              <hr className="mx-4" />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyReviews;
