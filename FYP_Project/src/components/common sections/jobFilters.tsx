import { useState } from "react";
import { Search, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
type Props = {
  currentUrl: string;
};
export default function JobFilters({ currentUrl }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [salaryType, setSalaryType] = useState("negotiable");

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [careerLevel, setCareerLevel] = useState("");
  const [company, setCompany] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState("");

  const navigate = useNavigate();
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (city) params.append("city", city);
    if (location) params.append("location", location);
    if (jobType) params.append("type", jobType);
    if (category) params.append("category", category);
    if (careerLevel) params.append("career_level", careerLevel);
    if (company) params.append("company", company);
    if (minSalary) params.append("min_salary", minSalary);
    if (maxSalary) params.append("max_salary", maxSalary);
    if (salaryPeriod) params.append("salary_period", salaryPeriod);
    navigate(`/browsejobs?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-2xl border bg-background p-6 shadow-sm space-y-5">
      {/* ROW 1 */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search Job */}
        <InputGroup className="h-11 flex-1">
          <InputGroupAddon>
            <Search size={18} />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Search job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        {/* City */}
        <InputGroup className="h-11 flex-1">
          <InputGroupAddon>
            <MapPin size={18} />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </InputGroup>

        <Button className="h-11 px-8" onClick={handleSearch}>
          Find Jobs
        </Button>
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Advanced Filters
      </button>

      {/* ADVANCED */}
      {showAdvanced && (
        <div className="space-y-4">
          {/* ROW 1 */}
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Enter company"
              className="w-full lg:w-[280px]"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <Select onValueChange={setJobType}>
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Time">Full-time</SelectItem>
                <SelectItem value="Part-Time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setLocation}>
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="West">West</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* ROW 2 */}
          <div className="flex flex-wrap gap-4">
            <Select onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Job Categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="admin">Admin & Secretarial</SelectItem>

                <SelectItem value="business">Business & Finance</SelectItem>

                <SelectItem value="engineering">Engineering</SelectItem>

                <SelectItem value="customer-support">
                  Customer Support
                </SelectItem>

                <SelectItem value="it">IT & Software</SelectItem>

                <SelectItem value="design">Design & Creative</SelectItem>

                <SelectItem value="education">Education & Training</SelectItem>

                <SelectItem value="healthcare">Healthcare & Science</SelectItem>

                <SelectItem value="legal">Legal & Security</SelectItem>

                <SelectItem value="logistics">
                  Logistics & Transportation
                </SelectItem>

                <SelectItem value="marketing">
                  Marketing & Advertising
                </SelectItem>

                <SelectItem value="freelance">Part-time & Freelance</SelectItem>

                <SelectItem value="sales">Sales & Retail</SelectItem>

                <SelectItem value="trades">Trades & Services</SelectItem>

                <SelectItem value="writing">Writing & Translation</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setCareerLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Career Level" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="entry">Entry Level/Early Career</SelectItem>

                <SelectItem value="experienced">
                  Experienced Professional
                </SelectItem>

                <SelectItem value="leadership">
                  Leadership/Management
                </SelectItem>

                <SelectItem value="owner">Independent/Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SALARY TYPE */}
          <div className="max-w-xs">
            <Select value={salaryType} onValueChange={setSalaryType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="negotiable">Negotiable</SelectItem>

                <SelectItem value="fixed">Fixed</SelectItem>

                <SelectItem value="range">Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {salaryType === "fixed" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                type="number"
                placeholder="Amount"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />

              <Select onValueChange={setSalaryPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Salary Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Month">Per month</SelectItem>
                  <SelectItem value="Year">Per year</SelectItem>
                  <SelectItem value="Hour">Per hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {salaryType === "range" && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Input
                type="number"
                placeholder="Min"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />

              <Input
                type="number"
                placeholder="Max"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
              />

              <Select onValueChange={setSalaryPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Salary Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Month">Per month</SelectItem>
                  <SelectItem value="Year">Per year</SelectItem>
                  <SelectItem value="Hour">Per hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
