import { useState } from "react";
import { Search, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  return (
    <div className="w-full rounded-2xl border bg-background p-6 shadow-sm space-y-5">
      {/* ROW 1 */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search Job */}
        <InputGroup className="h-11 flex-1">
          <InputGroupAddon>
            <Search size={18} />
          </InputGroupAddon>

          <InputGroupInput placeholder="Search job..." />
        </InputGroup>

        {/* City */}
        <InputGroup className="h-11 flex-1">
          <InputGroupAddon>
            <MapPin size={18} />
          </InputGroupAddon>

          <InputGroupInput placeholder="Enter city..." />
        </InputGroup>

        <Button className="h-11 px-8" onClick={() => navigate("/browsejobs")}>
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
            />

            <Select>
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
                <SelectItem value="central">Central</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* ROW 2 */}
          <div className="flex flex-wrap gap-4">
            <Select>
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

            <Select>
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

          {/* FIXED */}
          {salaryType === "fixed" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Input type="number" placeholder="Amount" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Salary Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="month">Per month</SelectItem>

                  <SelectItem value="year">Per year</SelectItem>

                  <SelectItem value="hour">Per hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* RANGE */}
          {salaryType === "range" && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Input type="number" placeholder="Min" />

              <Input type="number" placeholder="Max" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Salary Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="month">Per month</SelectItem>

                  <SelectItem value="year">Per year</SelectItem>

                  <SelectItem value="hour">Per hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
