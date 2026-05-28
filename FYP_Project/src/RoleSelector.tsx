export default function RoleSelector() {
  const role = localStorage.getItem("role") || "jobseeker";

  const changeRole = (newRole: "jobseeker" | "employer") => {
    localStorage.setItem("role", newRole);
    window.location.reload(); // simple refresh for now
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-semibold">Switch Role:</label>

      <select
        value={role}
        onChange={(e) =>
          changeRole(e.target.value as "jobseeker" | "employer")
        }
        className="ml-2 border px-2 py-1 rounded"
      >
        <option value="jobseeker">Jobseeker</option>
        <option value="employer">Employer</option>
      </select>
    </div>
  );
}