import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import "./JobFilters.css";

export default function JobFilters() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [salaryType, setSalaryType] = useState("negotiable");

  return (
    <div className="filterBox">
      {/* ROW 1 */}
      <div className="row">
        {/* Search Job */}
        <div className="inputWrapper">
          <Search className="icon" size={18} />
          <input className="input withIcon" placeholder="Search job..." />
        </div>

        {/* City */}
        <div className="inputWrapper">
          <MapPin className="icon" size={18} />
          <input className="input withIcon" placeholder="Enter city..." />
        </div>

        <button className="button">Find Jobs</button>
      </div>

      {/* ROW 2 */}
      <div className="toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? "▲" : "▼"} Advanced Filters
      </div>

      {/* ROW 3 */}
      {showAdvanced && (
        <div className="advanced">
          {/* ROW 3 - LINE 1 */}
          <div className="row">
            <input className="input" placeholder="Enter company" />

            <select className="input">
              <option>Duration</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>

            <select className="input">
              <option>Region</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
              <option>Central</option>
            </select>
          </div>

          {/* ROW 3 - LINE 2 */}
          <div className="row">
            <select className="input">
              <option>Job Categories</option>
              <option>Admin & Secretarial</option>
              <option>Business & Finance</option>
              <option>Engineering</option>
              <option>Customer Support</option>
              <option>IT & Software</option>
              <option>Design & Creative</option>
              <option>Education & Training</option>
              <option>Healthcare & Science</option>
              <option>Legal & Security</option>
              <option>Logistics & Transportation</option>
              <option>Marketing & Advertising</option>
              <option>Part-time & Freelance</option>
              <option>Sales & Retail</option>
              <option>Trades & Services</option>
              <option>Writing & Translation</option>
            </select>

            <select className="input">
              <option>Career Level</option>
              <option>Entry Level/Early Career</option>
              <option>Experienced Professional</option>
              <option>Leadership/Management</option>
              <option>Independent/Owner</option>
            </select>
          </div>

          {/* ROW 3 - SALARY */}
          <div className="salaryRow">
            <select
              className="input salarySelect"
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
            >
              <option value="negotiable">Negotiable</option>
              <option value="fixed">Fixed</option>
              <option value="range">Range</option>
            </select>
          </div>

          {/* FIXED */}
          {salaryType === "fixed" && (
            <div className="row">
              <input className="input" type="number" placeholder="Amount" />

              <select className="input">
                <option>Per month</option>
                <option>Per year</option>
                <option>Per hour</option>
              </select>
            </div>
          )}

          {/* RANGE */}
          {salaryType === "range" && (
            <div className="row">
              <input className="input" type="number" placeholder="Min" />
              <input className="input" type="number" placeholder="Max" />

              <select className="input">
                <option>Per month</option>
                <option>Per year</option>
                <option>Per hour</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
