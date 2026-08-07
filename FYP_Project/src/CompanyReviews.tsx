import { useEffect, useRef, useState } from "react";
import { Edit, Plus, StarHalfIcon, StarIcon, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "./AuthLayout";
import NavigationMenus from "./NavigationMenu";
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
  currentUrl: string;
};
function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
let dateChangedToProperReading = (date: string) => {
  let newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.toLocaleString("en-GB", { month: "long" });
  const year = newDate.getFullYear();
  return `${getOrdinal(day)} ${month} ${year}`;
};
type Reviews = {
  id: string;
  company_id: string;
  user_id: string;
  rating: number;
  message: string;
  created_at: string;
  username: string;
  profile_picture_file_url: string;
};
type Stars = {
  averageRating: number;
};
type RatingDistribution = {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
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
type Profile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  linkedin_profile: string;
  github_profile: string;
  profile_picture_url: string;
  default_resume_id: string;
};
const CompanyReviews = (prop: Props) => {
  const [rating, setRating] = useState(0);
  let [dataOfReviews, setDataOfReviews] = useState<Reviews[]>([]);
  let inputRef = useRef<HTMLInputElement>(null);
  let [numberOfReviews, setNumberOfReviews] = useState();
  let [averageRating, setAverageRating] = useState("");
  let [RatingDistribution, setRatingDistribution] =
    useState<RatingDistribution>();
  let [widthOfBar, setWidthOfBar] = useState<RatingDistribution>();
  let [classNameForAddReview, setClassNameForAddReview] =
    useState("self-center hidden");
  let [editRating, setEditRating] = useState(0);
  let [editReviews, setEditReviews] = useState("");
  let [profile, setProfile] = useState<Profile>();
  useEffect(() => {
    let address = new URL(window.location.href);
    let queryParameters = address.searchParams;
    let id = queryParameters.get("id");
    fetch(prop.currentUrl + "/user/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((values) => {
        return values.json();
      })
      .then((userProfile) => {
        setProfile(userProfile.profile);
        fetch(prop.currentUrl + "/reviews/company/" + id)
          .then((valueCannnotUse) => {
            return valueCannnotUse.json();
          })
          .then((values) => {
            setDataOfReviews(values.reviews);
            setNumberOfReviews(values.count);
            setAverageRating(values.statistics.average_rating);
            setRatingDistribution(values.statistics.rating_distribution);
            let newStuff: RatingDistribution = {
              1: "w-0",
              2: "w-0",
              3: "w-0",
              4: "w-0",
              5: "w-0",
            };
            let ratings: RatingDistribution =
              values.statistics.rating_distribution;

            for (const [key, value] of Object.entries(ratings)) {
              const max = Math.max(
                ...Object.values(
                  parseInt(values.statistics.rating_distribution),
                ),
                1,
              );
              let width = (parseInt(value) / max) * 100;
              let classses = "w-" + width;
              newStuff[key as keyof RatingDistribution] = classses;
            }
            setWidthOfBar(newStuff);
            fetch(prop.currentUrl + "/jobs/company/" + id + "/can-review", {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            })
              .then((valuesOfStuff) => {
                return valuesOfStuff.json();
              })
              .then((valueToCheck) => {
                if (valueToCheck.canReview) {
                  setClassNameForAddReview("self-center");
                }
              });
          });
      });
  }, []);
  return (
    <AuthLayout>
      <div>
        <NavigationMenus currentUrl={prop.currentUrl}/>
        <br />
        <div className="flex justify-between">
          <p className="text-left text-3xl font-semibold">Reviews</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className={classNameForAddReview}>
                <Plus /> Add reviews
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-black!">Add reviews</DialogTitle>
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
                    ref={inputRef}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() => {
                      let address = new URL(window.location.href);
                      let queryParameters = address.searchParams;
                      let id = queryParameters.get("id");
                      let body = JSON.stringify({
                        company_id: id,
                        rating: rating,
                        message: inputRef.current?.value,
                      });
                      fetch(prop.currentUrl + "/reviews", {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            "Bearer " + localStorage.getItem("token"),
                        },
                        method: "POST",
                        body: body,
                      })
                        .then((value) => {
                          return value.json();
                        })
                        .then(() => {
                          alert("Review has been added!");
                          window.location.reload()
                        });
                    }}
                  >
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
            <p className="font-semibold text-2xl ">{numberOfReviews}</p>
          </div>
          <div className="text-left  flex flex-col gap-2 h-full ">
            <p className="text-lg">Average Rating</p>
            <div className="flex gap-3">
              <p className="font-semibold text-2xl">{averageRating}</p>
              <StarsPage averageRating={parseFloat(averageRating)} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-3">
              <StarIcon className="self-center" fill="yellow" />
              <p className="font-semibold">5</p>
              <div
                className={"bg-green-700 rounded-2xl " + widthOfBar?.[5]}
              ></div>
              <p className="font-semibold">{RatingDistribution?.[5]}</p>
            </div>
            <div className="flex gap-3">
              <StarIcon className="self-center" fill="yellow" />
              <p className="font-semibold">4</p>
              <div
                className={"bg-[#00739D] rounded-2xl " + widthOfBar?.[4]}
              ></div>
              <p className="font-semibold">{RatingDistribution?.[4]}</p>
            </div>
            <div className="flex gap-3">
              <StarIcon className="self-center" fill="yellow" />
              <p className="font-semibold">3</p>
              <div
                className={"bg-amber-300 rounded-2xl " + widthOfBar?.[3]}
              ></div>
              <p className="font-semibold">{RatingDistribution?.[3]}</p>
            </div>
            <div className="flex gap-3">
              <StarIcon className="self-center" fill="yellow" />
              <p className="font-semibold">2</p>
              <div
                className={"bg-[#66009D] rounded-2xl " + widthOfBar?.[2]}
              ></div>
              <p className="font-semibold">{RatingDistribution?.[2]}</p>
            </div>
            <div className="flex gap-3">
              <StarIcon className="self-center" fill="yellow" />
              <p className="font-semibold">1</p>
              <div
                className={"bg-[#9D0000] rounded-2xl " + widthOfBar?.[1]}
              ></div>
              <p className="font-semibold">{RatingDistribution?.[1]}</p>
            </div>
          </div>
        </div>
        <hr className="mt-4 " />
        <div className="flex flex-col gap-3 mt-4">
          {dataOfReviews.map((value) => {
            if (profile) {

              if (value.user_id != profile.user_id) {
                return (
                  <>
                    <div className="flex p-5 gap-7 align-middle">
                      <div className="flex items-center justify-center">
                        <Avatar className="size-20">
                          <AvatarImage src={value.profile_picture_file_url} />
                          <AvatarFallback>ProfilePic</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-left flex flex-col align-middle h-full">
                        <p className="font-bold text-2xl">{value.username}</p>
                        <div className="flex flex-col gap-2 mt-2.5">
                          <p>{dateChangedToProperReading(value.created_at)}</p>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col gap-4">
                        <div className="flex gap-3">
                          <StarsPage averageRating={value.rating} />
                        </div>
                        <p className="text-left">{value.message}</p>
                      </div>
                    </div>
                    <hr className="mx-4" />
                  </>
                );
              } else {
                return (
                  <>
                    <div className="flex p-5 gap-7 align-middle">
                      <div className="flex items-center justify-center">
                        <Avatar className="size-20">
                          <AvatarImage src={value.profile_picture_file_url} />
                          <AvatarFallback>ProfilePic</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-left flex flex-col align-middle h-full">
                        <p className="font-bold text-2xl">{value.username}</p>
                        <div className="flex flex-col gap-2 mt-2.5">
                          <p>{dateChangedToProperReading(value.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex justify-between gap-10">
                        <div className="mt-1 flex flex-col gap-4">
                          <div className="flex gap-3">
                            <StarsPage averageRating={value.rating} />
                          </div>
                          <p className="text-left">{value.message}</p>
                        </div>
                        <div className="flex gap-5 mt-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Edit
                                onClick={() => {
                                  setEditRating(value.rating);
                                  setEditReviews(value.message);
                                }}
                              />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-black!">
                                  Edit reviews
                                </DialogTitle>
                                <DialogDescription>
                                  Help others learn what it’s like to work at
                                  this company by sharing your experience
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
                                        fill={
                                          star <= editRating
                                            ? "yellow"
                                            : "white"
                                        }
                                        onClick={() => setEditRating(star)}
                                      />
                                    ))}
                                  </div>
                                  <Input
                                    id="link"
                                    placeholder="The company culture is great!..."
                                    value={editReviews}
                                    onChange={(e) => {
                                      setEditReviews(e.currentTarget.value);
                                    }}
                                    minLength={10}
                                  />
                                </div>
                              </div>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      let body = JSON.stringify({
                                        rating: editRating,
                                        message: editReviews,
                                      });
                                      fetch(
                                        prop.currentUrl +
                                          "/reviews/" +
                                          value.id,
                                        {
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization:
                                              "Bearer " +
                                              localStorage.getItem("token"),
                                          },
                                          method: "PUT",
                                          body: body,
                                        },
                                      )
                                        .then((value) => {
                                          return value.json();
                                        })
                                        .then((things) => {
                                          if (things.error){
                                            alert(things.error)
                                          } else {
                                          window.location.reload();

                                          }
                                        });
                                    }}
                                  >
                                    Submit
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Trash
                            color="red"
                            onClick={() => {
                              fetch(prop.currentUrl + "/reviews/" + value.id, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization:
                                    "Bearer " + localStorage.getItem("token"),
                                },
                                method: "DELETE",
                              })
                                .then((value) => {
                                  if (value) {
                                    return value.json();
                                  }
                                })
                                .then(() => {
                                  window.location.reload();
                                });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <hr className="mx-4" />
                  </>
                );
              }
            } else {
              return (
                <>
                  <div className="flex p-5 gap-7 align-middle">
                    <div className="flex items-center justify-center">
                      <Avatar className="size-20">
                        <AvatarImage src={value.profile_picture_file_url} />
                        <AvatarFallback>ProfilePic</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-left flex flex-col align-middle h-full">
                      <p className="font-bold text-2xl">{value.username}</p>
                      <div className="flex flex-col gap-2 mt-2.5">
                        <p>{dateChangedToProperReading(value.created_at)}</p>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-col gap-4">
                      <div className="flex gap-3">
                        <StarsPage averageRating={value.rating} />
                      </div>
                      <p className="text-left">{value.message}</p>
                    </div>
                  </div>
                  <hr className="mx-4" />
                </>
              );
            }
          })}
        </div>
      </div>
    </AuthLayout>
  );
};

export default CompanyReviews;
