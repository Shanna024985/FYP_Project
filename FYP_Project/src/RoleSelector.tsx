import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function RoleSelector() {
  const role =
    localStorage.getItem("role") || "jobseeker";

  const changeRole = (
    newRole: "jobseeker" | "employer"
  ) => {
    localStorage.setItem("role", newRole);
    window.location.reload();
  };

  return (
    <div className="flex items-center">
      <span>Switch Role:</span>

      <Select
        value={role}
        onValueChange={(value) =>
          changeRole(value as "jobseeker" | "employer")
        }
      >
        <SelectTrigger className="ml-2 w-[140px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="jobseeker">
            Jobseeker
          </SelectItem>

          <SelectItem value="employer">
            Employer
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}