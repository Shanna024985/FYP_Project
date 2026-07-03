import React, { useState } from "react";
import NavigationMenus from "./NavigationMenu";
import { Field, FieldGroup, FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "./components/ui/native-select";
import { DatePickerNaturalLanguage } from "./DatePicker";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { CompanyPage } from "./CompanyPage";
type Props = {
  currentUrl: String;
};
const AddCompanies = (prop: Props) => {
  let [overviewPage, setOverviewPage] = React.useState("");
  let [name, setName] = React.useState("");
  let [location, setLocation] = React.useState("");
  let [locationCoordinates, setLocationCoordinates] = React.useState("");
  let [linkOfCompany, setLinkOfCompany] = React.useState("");
  let [emailOfCompany, setEmailOfCompany] = React.useState("");
  let [cities, setCities] = React.useState({
    Singapore: ["Singapore"],

    Japan: ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Sapporo", "Fukuoka"],

    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu"],

    China: [
      "Beijing",
      "Shanghai",
      "Guangzhou",
      "Shenzhen",
      "Chengdu",
      "Hangzhou",
    ],

    India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"],

    Thailand: ["Bangkok", "Chiang Mai", "Phuket"],

    Malaysia: ["Kuala Lumpur", "George Town", "Johor Bahru"],

    Indonesia: ["Jakarta", "Surabaya", "Bandung", "Denpasar"],

    Vietnam: ["Ho Chi Minh City", "Hanoi", "Da Nang"],

    "United Kingdom": [
      "London",
      "Manchester",
      "Birmingham",
      "Edinburgh",
      "Glasgow",
    ],

    France: ["Paris", "Lyon", "Marseille", "Nice"],

    Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],

    Italy: ["Rome", "Milan", "Naples", "Florence", "Venice"],

    Spain: ["Madrid", "Barcelona", "Valencia", "Seville"],

    Netherlands: ["Amsterdam", "Rotterdam", "The Hague"],

    "United States": [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "San Francisco",
      "Seattle",
      "Miami",
      "Boston",
    ],

    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],

    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],

    "New Zealand": ["Auckland", "Wellington", "Christchurch"],

    "United Arab Emirates": ["Dubai", "Abu Dhabi"],

    "South Africa": ["Cape Town", "Johannesburg", "Durban"],

    Brazil: ["São Paulo", "Rio de Janeiro", "Brasília"],

    Mexico: ["Mexico City", "Guadalajara", "Monterrey"],
  });
  let [companyType, setCompanyType] = useState([
    {
      value: "technology",
      label: "Technology",
    },
    {
      value: "finance-banking",
      label: "Finance & Banking",
    },
    {
      value: "food-beverages",
      label: "Food & Beverages",
    },
    {
      value: "healthcare",
      label: "Healthcare",
    },
    {
      value: "education",
      label: "Education",
    },
    {
      value: "retail",
      label: "Retail",
    },
    {
      value: "ecommerce",
      label: "E-Commerce",
    },
    {
      value: "manufacturing",
      label: "Manufacturing",
    },
    {
      value: "construction",
      label: "Construction",
    },
    {
      value: "real-estate",
      label: "Real Estate",
    },
    {
      value: "transportation-logistics",
      label: "Transportation & Logistics",
    },
    {
      value: "hospitality-tourism",
      label: "Hospitality & Tourism",
    },
    {
      value: "telecommunications",
      label: "Telecommunications",
    },
    {
      value: "media-entertainment",
      label: "Media & Entertainment",
    },
    {
      value: "marketing-advertising",
      label: "Marketing & Advertising",
    },
    {
      value: "consulting",
      label: "Consulting",
    },
    {
      value: "legal-services",
      label: "Legal Services",
    },
    {
      value: "insurance",
      label: "Insurance",
    },
    {
      value: "energy-utilities",
      label: "Energy & Utilities",
    },
    {
      value: "agriculture",
      label: "Agriculture",
    },
    {
      value: "automotive",
      label: "Automotive",
    },
    {
      value: "aerospace-defense",
      label: "Aerospace & Defense",
    },
    {
      value: "pharmaceuticals",
      label: "Pharmaceuticals",
    },
    {
      value: "biotechnology",
      label: "Biotechnology",
    },
    {
      value: "government-public-sector",
      label: "Government & Public Sector",
    },
    {
      value: "nonprofit-ngo",
      label: "Non-Profit & NGO",
    },
    {
      value: "human-resources-recruitment",
      label: "Human Resources & Recruitment",
    },
    {
      value: "cybersecurity",
      label: "Cybersecurity",
    },
    {
      value: "architecture-design",
      label: "Architecture & Design",
    },
    {
      value: "research-development",
      label: "Research & Development",
    },
    {
      value: "environmental-services",
      label: "Environmental Services",
    },
    {
      value: "sports-recreation",
      label: "Sports & Recreation",
    },
    {
      value: "fashion-apparel",
      label: "Fashion & Apparel",
    },
    {
      value: "beauty-cosmetics",
      label: "Beauty & Cosmetics",
    },
    {
      value: "gaming",
      label: "Gaming",
    },
    {
      value: "security-services",
      label: "Security Services",
    },
    {
      value: "events-management",
      label: "Events Management",
    },
    {
      value: "pet-care-veterinary",
      label: "Pet Care & Veterinary",
    },
    {
      value: "other",
      label: "Other",
    },
  ]);
  let [totalReviews, setTotalReviews] = React.useState(0);
  let [averageRating, setAverageRating] = React.useState(4.5);
  let [companyTypeChosen, setCompanyTypeChosen] = useState("");
  let [imageOfProfile, setImageOfProfile] = useState("");
  let [imageOfBanner, setBannerImage] = useState("");
  let [uploadedImageOfProfile, setUploadedImageOfProfile] = useState<File>();
  let [uploadedImageOfBanner, setUploadedImageOfBanner] = useState<File>();
  return (
    <div>
      <p className="text-left text-3xl font-semibold">Add companies</p>
      <hr className="mt-4" />
      <div className="flex gap-4 mt-5">
        <div className="flex-1 justify-start">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formDataForProfile = new FormData();
              if (uploadedImageOfProfile) {
                formDataForProfile.append("file", uploadedImageOfProfile);
              fetch(prop.currentUrl + "/upload/company-logo", {
                method: "POST",
                body: formDataForProfile,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              })
                .then((value) => {
                  if (value.status == 200) {
                    console.log("Uploaded profile pic");
                    return value.json();
                  }
                })
                .then((valueOfProfile) => {
                  let newFormDataForBanner = new FormData();
                  if (uploadedImageOfBanner) {
                    newFormDataForBanner.append("file", uploadedImageOfBanner);
                    
                  fetch(prop.currentUrl + "/upload/company-banner", {
                    method: "POST",
                    body: newFormDataForBanner,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  })
                    .then((value) => {
                      if (value.status == 200) {
                        return value.json();
                      }
                    })
                    .then((valueOfBanner) => {
                      let bodyForAddingCompany = JSON.stringify({
                        name: name,
                        url: linkOfCompany,
                        contact_email: emailOfCompany,
                        logo_file_name: valueOfProfile.logo_file_name,
                        logo_file_data: valueOfProfile.logo_file_data,
                        banner_file_name: valueOfBanner.banner_file_name,
                        banner_file_data: valueOfBanner.banner_file_data,
                        description: overviewPage,
                        city: location.split(",")[0],
                      });

                      fetch(prop.currentUrl + "/api/company", {
                        method: "POST",
                        body: bodyForAddingCompany,
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            "Bearer " + localStorage.getItem("token"),
                        },
                      }).then((valuesReturned) => {
                        if (valuesReturned.status == 201) {
                          alert("Successfully added the company");
                        }
                      });
                    });
                  }
                  
                });
              }
              
            }}
          >
            <p className="text-xl text-left">Company details</p>
            <FieldGroup className="mt-8">
              <Field>
                <FieldLabel htmlFor="titleName">Company Name</FieldLabel>
                <Input
                  id="titleName"
                  required
                  placeholder="Backend Engineer"
                  onInput={(e) => {
                    setName(e.currentTarget.value);
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="We need..."
                  required
                  onInput={(e) => {
                    setOverviewPage(e.currentTarget.value);
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Company Type</FieldLabel>
                <Select
                  required
                  onValueChange={(e) => {
                    companyType.forEach((value) => {
                      if (value.value == e) {
                        setCompanyTypeChosen(value.label);
                      }
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companyType.map((type) => {
                        return (
                          <>
                            <SelectItem value={type.value} key={type.value}>
                              {type.label}
                            </SelectItem>
                          </>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  id="email"
                  required
                  onInput={(e) => {
                    setEmailOfCompany(e.currentTarget.value);
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="locationDropdown">Location</FieldLabel>
                <Select
                  required
                  onValueChange={(e) => {
                    console.log(e);
                    Object.entries(cities).forEach(
                      ([countries, citiesLoop]) => {
                        citiesLoop.forEach((value) => {
                          if (value === e) {
                            setLocation(value + ", " + countries);
                          }
                        });
                      },
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(cities).map(([country, citiesLoop]) => {
                        return (
                          <>
                            <React.Fragment key={country}>
                              <SelectLabel>{country}</SelectLabel>
                              {citiesLoop.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </React.Fragment>
                          </>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="addressOfCompany">Address</FieldLabel>
                <Input
                  placeholder="12 john st, 123456"
                  id="addressOfCompany"
                  onInput={(e) => {
                    let value = e.currentTarget.value;
                    let newvalue = "";
                    for (const char of value) {
                      if (char === " ") {
                        newvalue += "+";
                      } else {
                        newvalue += char;
                      }
                      setLocationCoordinates(newvalue);
                    }
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="noofjobs">Website</FieldLabel>
                <Input
                  required
                  id="noofjobs"
                  placeholder="example.com"
                  onInput={(e) => {
                    setLinkOfCompany(e.currentTarget.value);
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="imageForBanner">Banner Image</FieldLabel>
                <Input
                  required
                  id="imageForBanner"
                  type="file"
                  onInput={(event) => {
                    let files = event.currentTarget.files;
                    if (files) {
                      if (files.length > 0) {
                        const file = files[0];
                        setUploadedImageOfBanner(file);

                        let url = URL.createObjectURL(file);
                        setBannerImage(url);
                      }
                    }
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="imageForProfile">Profile Image</FieldLabel>
                <Input
                  id="imageForProfile"
                  type="file"
                  required
                  onInput={(event) => {
                    let files = event.currentTarget.files;
                    if (files) {
                      if (files.length > 0) {
                        const file = files[0]; // Get the first file

                        console.log("File Name:", file.name); // e.g., "document.pdf"
                        console.log("File Size:", file.size); // Size in bytes
                        console.log("File Type:", file.type); // MIME type, e.g., "application/pdf"
                        let url = URL.createObjectURL(file);
                        setImageOfProfile(url);
                        setUploadedImageOfProfile(file);
                      }
                    }
                  }}
                />
              </Field>
            </FieldGroup>
            <div className="justify-self-start">
              <Button className="mt-5" type="submit">
                Create
              </Button>
            </div>
          </form>
        </div>
        <div className="flex-1">
          <p className="text-xl text-left">Preview</p>
          <CompanyPage
            bannerImage={imageOfBanner}
            setBannerImage={setBannerImage}
            profileImage={imageOfProfile}
            setProfileImage={setImageOfProfile}
            totalReviews={totalReviews}
            totalReviewsFunction={setTotalReviews}
            name={name}
            setName={setName}
            linkOfCompany={linkOfCompany}
            setLinkOfCompany={setLinkOfCompany}
            emailOfCompany={emailOfCompany}
            setEmailOfCompany={setEmailOfCompany}
            location={location}
            setLocation={setLocation}
            locationCoordinates={locationCoordinates}
            setLocationCoordinates={setLocationCoordinates}
            overviewPage={overviewPage}
            setOverviewPage={setOverviewPage}
            companyType={companyTypeChosen}
            companyTypeFunction={setCompanyTypeChosen}
            averageRating={averageRating}
            setAverageRating={setAverageRating}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCompanies;
