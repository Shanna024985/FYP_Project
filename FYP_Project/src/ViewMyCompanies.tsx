import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationMenus from "./NavigationMenu";
import Error from "./Error";

import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import "./title.css";
import {
  Eye,
  Pencil,
  Plus,
  Building2,
} from "lucide-react";

type Props = {
  currentUrl: string;
};

type Company = {
  id: number;
  name: string;
  city: string;
  contact_email: string;
  logo_url: string;
  total_jobs: number;
  active_jobs: number;
};

const ViewMyCompanies = (props: Props) => {
  if (!localStorage.getItem("token")) {
    return (
      <Error
        status={403}
        description="You do not have permission to access this page"
        pageLinkForRedirect="/"
        pageForRedirect="Home"
      />
    );
  }

  return <ViewCompaniesPage currentUrl={props.currentUrl} />;
};

const ViewCompaniesPage = ({ currentUrl }: Props) => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetch(currentUrl + "/company/user/companies", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data.companies || []);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <NavigationMenus currentUrl="" />

      <div className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black! dark:text-white!">My Companies</h1>
            <p className="text-muted-foreground">
              Manage all companies that you own.
            </p>
          </div>

          <Button
            className="bg-[#2A88E0]"
            onClick={() => navigate("/addcompanies")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        <div className="mt-6 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Total Jobs</TableHead>
                <TableHead>Active Jobs</TableHead>
                <TableHead className="text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No companies found.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="h-10 w-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full border flex items-center justify-center">
                            <Building2 size={18} />
                          </div>
                        )}

                        <span className="font-medium">
                          {company.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{company.city}</TableCell>

                    <TableCell>{company.contact_email}</TableCell>

                    <TableCell>{company.total_jobs}</TableCell>

                    <TableCell>{company.active_jobs}</TableCell>

                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            navigate("/company?id=" + company.id)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            navigate("/editCompany/" + company.id)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ViewMyCompanies;