import React, { useEffect } from "react";
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
import { el } from "date-fns/locale";

type Props = {
  currentUrl: String;
};
type ArrayType = {
  name: string;
  jobType: string;
  location: string;
  id: number;
};
type Stars = {
  averageRating: number;
};
type PropsForCompanyPage = {
  overviewPage: string;
  setOverviewPage: Function;
  location: string;
  setLocation: Function;
  linkOfCompany: string;
  setLinkOfCompany: Function;
  emailOfCompany: string;
  setEmailOfCompany: Function;
  locationCoordinates: string;
  setLocationCoordinates: Function;
  name: string;
  setName: Function;
  companyType: string;
  companyTypeFunction: Function;
  totalReviews: number;
  averageRating: number;
  setAverageRating: Function;
  jobPostings?: Array<ArrayType>;
  jobPostingsFunction?: Function;
  totalReviewsFunction: Function;
  profileImage: string;
  setProfileImage: Function;
  bannerImage: string;
  setBannerImage: Function;
};
export const CompanyPageRenderer = (prop: Props) => {
  let [imageOfTea, setImageOfTea] = React.useState("../public/IMG_0230 copy.jpeg");
  let [imageOfBanner, setImageOfBanner] = React.useState("../public/IMG_0049.JPG");
  let [name, setName] = React.useState("Green Tea");
  let [overviewPage, setOverviewPage] = React.useState(
    "We sell green tea for everyone to experience a taste of authentic Matcha from Japan",
  );
  let [location, setLocation] = React.useState("Uji, Japan");
  let [locationCoordinates, setLocationCoordinates] = React.useState(
    "34.8915979005778,135.7935469233096",
  );
  let [linkOfCompany, setLinkOfCompany] = React.useState("greentea.com");
  let [emailOfCompany, setEmailOfCompany] = React.useState(
    "example@outlook.com",
  );
  let [companyType, setCompanyType] = React.useState(
    "Food and Beverage Services",
  );
  let [averageRating, setAverageRating] = React.useState(4.3);
  let [jobPostingsRender, setJobPostings] = React.useState<ArrayType[]>([
    {
      name: "Tea Master",
      jobType: "Green Tea",
      location: "Fukuoka, Japan",
      id: 3,
    },
    {
      name: "Tea Master",
      jobType: "Green Tea",
      location: "Fukuoka, Japan",
      id: 5,
    },
    {
      name: "Tea Master",
      jobType: "Green Tea",
      location: "Fukuoka, Japan",
      id: 6,
    },
  ]);
  let [totalReviews, setTotalReviews] = React.useState(4000);
  return (
    <>
      <CompanyPage
        profileImage={imageOfTea}
        setProfileImage={setImageOfTea}
        bannerImage={imageOfBanner}
        setBannerImage={setImageOfBanner}
        jobPostingsFunction={setJobPostings}
        totalReviewsFunction={setTotalReviews}
        totalReviews={totalReviews}
        jobPostings={jobPostingsRender}
        averageRating={averageRating}
        setAverageRating={setAverageRating}
        companyType={companyType}
        companyTypeFunction={setCompanyType}
        name={name}
        setName={setName}
        overviewPage={overviewPage}
        setOverviewPage={setOverviewPage}
        linkOfCompany={linkOfCompany}
        setLinkOfCompany={setLinkOfCompany}
        emailOfCompany={emailOfCompany}
        setEmailOfCompany={setEmailOfCompany}
        location={location}
        setLocation={setLocation}
        locationCoordinates={locationCoordinates}
        setLocationCoordinates={setLocationCoordinates}
      />
    </>
  );
};
let StarsPage = (prop: Stars) => {
  const stars = [];
  let previousNumber = 0
  for (let i = 1; i <= 5; i++) {
    if (prop.averageRating >= i) {
      stars.push(<StarIcon className="self-center" fill="yellow" key={i} />);
      previousNumber = i
    } else if (prop.averageRating < i && prop.averageRating > previousNumber){
      stars.push(<StarHalfIcon className="self-center" fill="yellow" key={i}/>)
      previousNumber = i
    } 
  }
  return stars
};
let ReviewsToString = (averageRating: number) =>{
  if (averageRating >= 1000){
    let amountDivided = averageRating/1000
    if (Number.isInteger(amountDivided)){
    return amountDivided + ".0k"

    } else {
      return amountDivided + "k"
    }
  }
}
export const CompanyPage = (prop: PropsForCompanyPage) => {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <img
          src={prop.bannerImage}
          alt="banner"
          className="object-cover h-40 w-full rounded-md"
        />
      </div>
      <div className="flex p-5 gap-7">
        <div className="flex items-center justify-center">
          <Avatar className="size-35">
            <AvatarImage src={prop.profileImage} />
            <AvatarFallback>ProfilePic</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-left flex flex-col">
          <p className="font-bold text-2xl">{prop.name}</p>
          <div className="flex flex-col gap-2 mt-2.5">
            <p>{prop.companyType}</p>

            <a
              href={"http://google.com/maps?q=" + prop.locationCoordinates}
              target="_blank"
              className="flex gap-2 align-middle text-sm"
            >
              <MapPin className="self-center" /> {prop.location}
            </a>
            <a
              href={"mailto:" + prop.emailOfCompany}
              className="flex gap-2 align-middle text-sm"
            >
              <Mail className="self-center " /> {prop.emailOfCompany}
            </a>
            <a
              href={prop.linkOfCompany}
              className="flex gap-2 align-middle text-sm"
            >
              <Link className="self-center " /> {prop.linkOfCompany}
            </a>
          </div>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex-2 flex flex-col gap-5">
          <div className="bg-[#F2E9D9] text-left p-4 rounded-md gap-4 flex-col flex h-fit">
            <p className="font-bold text-2xl">Overview</p>
            <p>{prop.overviewPage}</p>
          </div>

          <div className="bg-[#F2E9D9] text-left p-4 rounded-md gap-4 flex-col  flex h-fit">
            {prop.totalReviews == 0 ? (
              <>
                <p className="text-xl text-gray-500">
                  There are no ratings given to the company
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <div className="text-left w-full flex flex-col gap-2">
                    <p className="font-bold text-2xl">Average Rating</p>
                    <div className="flex mt-2 gap-3">
                      <p className="text-3xl">{prop.averageRating}</p>
                      <StarsPage averageRating={prop.averageRating}/>
                    </div>
                    <p className="text-sm text-gray-400">
                      Average rating on this year performance
                    </p>
                  </div>

                  <div className="text-left w-full flex flex-col gap-2">
                    <p className="font-bold text-2xl ">Total Reviews</p>
                    {
                      prop.totalReviews > 1000 ? (
                        <p className="text-3xl">{ReviewsToString(prop.totalReviews)}</p>
                      ) : (
                        <p className="text-3xl">{prop.totalReviews}</p>
                      )
                    }
                    <Button
                      className="w-fit"
                      onClick={(e) => {
                        navigate("/companyreviews");
                      }}
                    >
                      View all reviews
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 bg-[#F2E9D9] rounded-md text-left p-4">
          <p className="font-bold text-2xl">Job Postings</p>
          <div className="mt-4 flex flex-col gap-4 h-54 overflow-y-scroll">
            {prop.jobPostings?.length === undefined ? (
              <p className="text-xl text-gray-500">
                There are no job postings by the company
              </p>
            ) : (
              prop.jobPostings?.map((value, index) => {
                if (prop.jobPostings) {
                  if (index < prop.jobPostings?.length - 1) {
                    return (
                      <>
                        <div
                          className="flex gap-4 justify-between"
                          key={value.id}
                        >
                          <div className="flex gap-4">
                            <div className="self-center">
                              <Avatar className="size-17">
                                <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                                <AvatarFallback>ProfilePic</AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <p className="font-bold text-lg">{value.name}</p>
                              <p>{value.jobType}</p>
                              <p className="text-sm">{value.location}</p>
                            </div>
                          </div>

                          <div className="flex">
                            <SquareArrowOutUpRightIcon
                              className="self-center justify-end"
                              onClick={(e) => {
                                navigate("/jobDetails?id=" + value.id);
                              }}
                            />
                          </div>
                        </div>
                        <hr className="border-t border-black" />
                      </>
                    );
                  } else {
                    return (
                      <>
                        <div
                          className="flex gap-4 justify-between"
                          key={value.id}
                        >
                          <div className="flex gap-4">
                            <div className="self-center">
                              <Avatar className="size-17">
                                <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                                <AvatarFallback>ProfilePic</AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <p className="font-bold text-lg">{value.name}</p>
                              <p>{value.jobType}</p>
                              <p className="text-sm">{value.location}</p>
                            </div>
                          </div>

                          <div className="flex">
                            <SquareArrowOutUpRightIcon
                              className="self-center justify-end"
                              onClick={(e) => {
                                navigate("/jobDetails?id=" + value.id);
                              }}
                            />
                          </div>
                        </div>
                      </>
                    );
                  }
                }
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
