import { useState } from "react";
import { Upload } from "lucide-react";
import { useRef } from "react";
import JobListItem from "./components/common sections/JobListItem";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Job } from "@/types/job";
import NavigationMenus from "./NavigationMenu";
import Sidebar from "./Sidebar";

type Props = {
  currentUrl: string;
};

export default function ApplyJobPage({ currentUrl }: Props) {
  const token = localStorage.getItem("token");

  const [job] = useState<Job>({
    id: 1,
    title: "Frontend Developer",
    description: "Build responsive React applications.",
    salary: "$3000 - $5000",
    location: "Singapore",
    tags: ["React", "TypeScript"],
    date: "12 Aug 2026",
    companyLogo: "https://placehold.co/100x100",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    proposal: "",
    resume: null as File | null,
  });

  const [useDefaultResume, setUseDefaultResume] = useState(true);

  const hasDefaultResume = token;

  const handleSubmit = () => {
    console.log({
      currentUrl,
      jobId: job.id,
      ...form,
      useDefaultResume,
    });

    // backend later
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex">
      {token && <Sidebar />}
      <div className="flex-1 p-4">
        <NavigationMenus />
        <div className="w-full space-y-6">
          {/* ROW 1 */}
          <JobListItem
            title={job.title}
            description={job.description}
            salary={job.salary}
            location={job.location}
            tags={job.tags}
            date={job.date}
            companyLogo={job.companyLogo}
          />

          <Card>
            <CardContent className="space-y-5">
              {/* ROW 2 */}
              <div>
                <label className="font-medium">Name *</label>

                <input
                  className="w-full border rounded-md p-2 mt-1"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* ROW 3 */}
              <div>
                <label className="font-medium">Email *</label>

                <input
                  type="email"
                  className="w-full border rounded-md p-2 mt-1"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* ROW 4 */}
              <div>
                <label className="font-medium">Phone *</label>

                <input
                  className="w-full border rounded-md p-2 mt-1"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              {/* ROW 5 */}
              <div>
                <label className="font-medium">Proposal *</label>

                <textarea
                  rows={6}
                  className="w-full border rounded-md p-2 mt-1"
                  value={form.proposal}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      proposal: e.target.value,
                    })
                  }
                />
              </div>

              {/* ROW 6 */}
              <div className="space-y-3">
                <label className="font-medium">Resume *</label>

                {/* ================= GUEST USER ================= */}
                {!token && (
                  <>
                    {/* UPLOAD BOX */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted transition"
                    >
                      <Upload className="mx-auto mb-2 text-muted-foreground" />

                      <p className="text-sm font-medium">
                        Click to upload resume
                      </p>

                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>

                    {/* hidden input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          resume: e.target.files?.[0] ?? null,
                        })
                      }
                    />

                    {/* selected file */}
                    {form.resume && (
                      <div className="text-sm text-muted-foreground">
                        Selected:{" "}
                        <span className="font-medium">{form.resume.name}</span>
                      </div>
                    )}
                  </>
                )}

                {/* ================= LOGGED IN USER ================= */}
                {token && hasDefaultResume && (
                  <>
                    {/* DEFAULT RESUME */}
                    <div className="rounded-md border p-3">
                      <p className="text-sm text-muted-foreground">
                        Current Resume:
                      </p>
                      <div className="font-medium">resume.pdf</div>
                    </div>

                    {/* USE DEFAULT CHECKBOX */}
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={useDefaultResume}
                        onChange={(e) => setUseDefaultResume(e.target.checked)}
                      />
                      Use default resume
                    </label>

                    {/* UPLOAD BOX (override option) */}
                    {!useDefaultResume && (
                      <>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-pointer border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted transition"
                        >
                          <Upload className="mx-auto mb-2 text-muted-foreground" />

                          <p className="text-sm font-medium">
                            Upload new resume
                          </p>

                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, DOCX (max 5MB)
                          </p>
                        </div>

                        {/* hidden input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) =>
                            setForm({
                              ...form,
                              resume: e.target.files?.[0] ?? null,
                            })
                          }
                        />

                        {/* selected file */}
                        {form.resume && (
                          <div className="text-sm text-muted-foreground">
                            Selected:{" "}
                            <span className="font-medium">
                              {form.resume.name}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* ================= LOGGED IN NO RESUME ================= */}
                {token && !hasDefaultResume && (
                  <>
                    {/* UPLOAD BOX (required) */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted transition"
                    >
                      <Upload className="mx-auto mb-2 text-muted-foreground" />

                      <p className="text-sm font-medium">
                        Upload resume (required)
                      </p>

                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>

                    {/* hidden input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          resume: e.target.files?.[0] ?? null,
                        })
                      }
                    />

                    {/* selected file */}
                    {form.resume && (
                      <div className="text-sm text-muted-foreground">
                        Selected:{" "}
                        <span className="font-medium">{form.resume.name}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Button className="w-full" onClick={handleSubmit}>
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
