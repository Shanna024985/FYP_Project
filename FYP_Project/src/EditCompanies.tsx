import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field, FieldGroup, FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";
import { toast } from "sonner";
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
import { Spinner } from "./components/ui/spinner";
type Props = {
  currentUrl: String;
};
const EditCompany = (prop: Props) => {
  let [overviewPage, setOverviewPage] = React.useState("");
  let [name, setName] = React.useState("");
  let [location, setLocation] = React.useState("");
  let [locationCoordinates, setLocationCoordinates] = React.useState("");
  let [linkOfCompany, setLinkOfCompany] = React.useState("");
  let [emailOfCompany, setEmailOfCompany] = React.useState("");
  let [cities] = React.useState({
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
  let [companyType] = useState([
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
  const navigate = useNavigate();
  const { id } = useParams();
  let [textOfButton, setTextOfButton] = useState("Save Changes");
  let [totalReviews, setTotalReviews] = React.useState(0);
  let [averageRating, setAverageRating] = React.useState(4.5);
  let [companyTypeChosen, setCompanyTypeChosen] = useState("");
  let [imageOfProfile, setImageOfProfile] = useState("");
  let [imageOfBanner, setBannerImage] = useState("");
  let [uploadedImageOfProfile, setUploadedImageOfProfile] = useState<File>();
  let [uploadedImageOfBanner, setUploadedImageOfBanner] = useState<File>();
  let [classesOfLoadingLogo, setClassesOfLoadingLogo] =
    React.useState("hidden");
  React.useEffect(() => {
    fetch(`${prop.currentUrl}/company/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const company = data.company;

        setName(company.name);
        setOverviewPage(company.description);
        setEmailOfCompany(company.contact_email);
        setLinkOfCompany(company.url);
        setLocationCoordinates(company.address);

        // Find which country this city belongs to
        let fullLocation = company.city;

        Object.entries(cities).forEach(([country, cityList]) => {
          if (cityList.includes(company.city)) {
            fullLocation = `${company.city}, ${country}`;
          }
        });

        setLocation(fullLocation);

        setImageOfProfile(company.logo_url);
        setBannerImage(company.banner_url);
      });
  }, [id]);
  return (
    <div>
      <p className="text-left text-3xl font-semibold">Edit company</p>
      <hr className="mt-4" />
      <div className="flex gap-4 mt-5">
        <div className="flex-1 justify-start">
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const button = document.getElementById("creatingCompanyButton");
              if (button) {
                setTextOfButton("Processing");
                setClassesOfLoadingLogo("");
                button.setAttribute("disabled", "");
              }

              try {
                // Use existing image URLs by default
                let logoUrl = imageOfProfile;
                let bannerUrl = imageOfBanner;

                // Upload new profile image if selected
                if (uploadedImageOfProfile) {
                  const formData = new FormData();
                  formData.append("logo", uploadedImageOfProfile);

                  const res = await fetch(
                    `${prop.currentUrl}/upload/company-logo`,
                    {
                      method: "POST",
                      body: formData,
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    },
                  );

                  if (res.ok) {
                    const data = await res.json();
                    logoUrl = data.logo_url;
                  }
                }

                // Upload new banner image if selected
                if (uploadedImageOfBanner) {
                  const formData = new FormData();
                  formData.append("banner", uploadedImageOfBanner);

                  const res = await fetch(
                    `${prop.currentUrl}/upload/company-banner`,
                    {
                      method: "POST",
                      body: formData,
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    },
                  );

                  if (res.ok) {
                    const data = await res.json();
                    bannerUrl = data.banner_url;
                  }
                }

                // Update company
                const body = {
                  name,
                  url: linkOfCompany,
                  contact_email: emailOfCompany,
                  banner_url: bannerUrl,
                  logo_url: logoUrl,
                  tagline: companyTypeChosen,
                  description: overviewPage,
                  city: location.split(",")[0],
                  address: locationCoordinates,
                };

                const response = await fetch(
                  `${prop.currentUrl}/company/${id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify(body),
                  },
                );

                if (response.ok) {
                  await response.json();

                  toast.success("Company updated successfully!");

                  setTimeout(() => {
                    navigate(`/company?id=${id}`);
                  }, 1000); // Gives users time to see the toast
                }
              } catch (err) {
                console.error(err);
              } finally {
                setTextOfButton("Save Changes");
                setClassesOfLoadingLogo("hidden");
                button?.removeAttribute("disabled");
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="We need..."
                  required
                  value={overviewPage}
                  onChange={(e) => setOverviewPage(e.target.value)}
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
                  value={emailOfCompany}
                  onChange={(e) => setEmailOfCompany(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="locationDropdown">Location</FieldLabel>
                <Select
                  required
                  value={location.split(",")[0]}
                  onValueChange={(e) => {
                    Object.entries(cities).forEach(([country, cityList]) => {
                      if (cityList.includes(e)) {
                        setLocation(`${e}, ${country}`);
                      }
                    });
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
                  value={locationCoordinates}
                  onChange={(e) => setLocationCoordinates(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="noofjobs">Website</FieldLabel>
                <Input
                  required
                  id="noofjobs"
                  placeholder="example.com"
                  value={linkOfCompany}
                  onChange={(e) => setLinkOfCompany(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="imageForBanner">Banner Image</FieldLabel>
                <Input
                  //   required
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
                  //   required
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
              <Button className="mt-5" type="submit" id="creatingCompanyButton">
                <Spinner
                  data-icon="inline-start"
                  className={classesOfLoadingLogo}
                  id="loadingLogo"
                />
                {textOfButton}
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

export default EditCompany;
