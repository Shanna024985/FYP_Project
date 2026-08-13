import { Upload } from "lucide-react";
import { useRef } from "react";
import JobListItem from "./components/common sections/JobListItem";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Job } from "@/types/job";
import { Navigate } from "react-router-dom";

type Props = {
  currentUrl: string;
};

export default function ApplyJobPage({ currentUrl }: Props) {
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  useEffect(() => {
    if (!jobId || !token) return;

    const checkApplication = async () => {
      try {
        const res = await axios.get(
          `${currentUrl}/jobs/applications/check/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setHasApplied(res.data.applied);
      } catch (err) {
        console.error("Failed to check application status:", err);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [jobId, currentUrl, token]);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const proposalRef = useRef<HTMLTextAreaElement>(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    proposal: "",
    resume: "",
  });
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  type Resume = {
    id: number;
    user_id: number;
    file_name: string;
    file_data: string;
    is_default: boolean;
  };

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const [resumes, setResumes] = useState<Resume[]>([]);
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${currentUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile({
        first_name: res.data.profile.first_name || "",
        last_name: res.data.profile.last_name || "",
        email: res.data.profile.email || "",
        phone_number: res.data.profile.phone_number || "",
      });
    } catch (err) {
      console.error(err);
    }
  };
  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${currentUrl}/resumes/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResumes(res.data.resumes);
    } catch (err) {
      console.error(err);
    }
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    proposal: "",
  });
  useEffect(() => {
    if (!token) return;

    fetchProfile();
    fetchResumes();
  }, [token, currentUrl]);
  useEffect(() => {
    if (!jobId) return;

    const fetchData = async () => {
      try {
        // Fetch job
        const jobRes = await axios.get(`${currentUrl}/jobs/${jobId}`);
        const jobData = jobRes.data.job;

        setJob(jobData);

        // Fetch company
        const companyRes = await axios.get(
          `${currentUrl}/company/${jobData.company_id}`,
        );

        setCompany(companyRes.data.company);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, currentUrl]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: `${profile.first_name} ${profile.last_name}`.trim(),
      email: profile.email,
      phone: profile.phone_number,
    }));
  }, [profile]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  useEffect(() => {
    if (resumes.length === 0) return;

    const defaultResume = resumes.find((r) => r.is_default);

    if (defaultResume) {
      setSelectedResumeId(defaultResume.id);
    } else {
      setSelectedResumeId(resumes[0].id);
    }
  }, [resumes]);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadedResume(file);

    // don't use an existing resume
    setSelectedResumeId(null);

    setErrors((prev) => ({
      ...prev,
      resume: "",
    }));

    toast.success("Resume selected.");
  };
  const viewResume = (resume: Resume) => {
    // Convert base64 to binary
    const byteCharacters = atob(resume.file_data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // Detect file type
    const extension = resume.file_name.split(".").pop()?.toLowerCase();

    let mimeType = "application/pdf";

    if (extension === "doc") {
      mimeType = "application/msword";
    } else if (extension === "docx") {
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const viewUploadedResume = () => {
    if (!uploadedResume) return;

    const url = URL.createObjectURL(uploadedResume);

    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const handleSubmit = async () => {
    if (!job) return;

    const newErrors = {
      name: form.name.trim() ? "" : "Name is required.",

      email: !form.email.trim()
        ? "Email is required."
        : !isValidEmail(form.email)
          ? "Please enter a valid email address."
          : "",

      phone: form.phone.trim() ? "" : "Phone number is required.",

      proposal: form.proposal.trim() ? "" : "Proposal is required.",

      resume:
        selectedResumeId || uploadedResume
          ? ""
          : "Please select or upload a resume.",
    };

    setErrors(newErrors);

    if (newErrors.name) {
      nameRef.current?.focus();
      return;
    }

    if (newErrors.email) {
      emailRef.current?.focus();
      return;
    }

    if (newErrors.phone) {
      phoneRef.current?.focus();
      return;
    }

    if (newErrors.proposal) {
      proposalRef.current?.focus();
      return;
    }

    if (newErrors.resume) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("fullname", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("proposal", form.proposal);

      if (uploadedResume) {
        // upload temporary resume
        formData.append("resume", uploadedResume);
      } else if (selectedResumeId) {
        // use an existing resume
        formData.append("resumeId", String(selectedResumeId));
      }

      await axios.post(`${currentUrl}/jobs/${job.id}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHasApplied(true);

      toast.success("Application submitted successfully.");
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("You have already applied for this job.");
      } else {
        toast.error("Failed to submit application.");
      }
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job || !company) {
    return <div>Job not found.</div>;
  }
  return (
    <div className="flex-1 p-4">
      <div className="w-full space-y-6">
        {/* ROW 1 */}
        <JobListItem
          currentUrl={currentUrl}
          jobId={job.id}
          title={job.title}
          description={job.description}
          salaryRangeFrom={job.salary_range_from}
          salaryRangeTo={job.salary_range_to}
          salaryType={job.salary_type}
          salaryPeriod={job.salary_period}
          location={job.location}
          address={job.address}
          tags={[job.category, job.type]}
          created_date={new Date(job.created_at).toLocaleDateString()}
          updated_date={new Date(job.updated_at).toLocaleDateString()}
          companyLogo={company?.logo_url || "/default-company.png"}
        />
        {checkingApplication ? (
          <div className="p-6 text-center">
            Checking application status...
          </div>
        ) : hasApplied ? (
          <div className="rounded-md border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-lg font-semibold text-green-700">
              Already Applied
            </p>

            <p className="mt-1 text-sm text-green-600">
              You have already submitted an application for this job.
            </p>
          </div>
        ) : (
          <Card>
            <CardContent className="space-y-5">
              <fieldset disabled={hasApplied} className="space-y-5">

                {/* ROW 2 */}
                <div>
                  <label className="font-medium">Name *</label>

                  <input
                    ref={nameRef}
                    className="w-full border rounded-md p-2 mt-1"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });

                      setErrors((prev) => ({
                        ...prev,
                        name: "",
                      }));
                    }}
                  />

                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* ROW 3 */}
                <div>
                  <label className="font-medium">Email *</label>

                  <input
                    ref={emailRef}
                    type="email"
                    className="w-full border rounded-md p-2 mt-1"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });

                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }}
                  />

                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* ROW 4 */}
                <div>
                  <label className="font-medium">Phone *</label>

                  <input
                    ref={phoneRef}
                    className="w-full border rounded-md p-2 mt-1"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });

                      setErrors((prev) => ({
                        ...prev,
                        phone: "",
                      }));
                    }}
                  />

                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* ROW 5 */}
                <div>
                  <label className="font-medium">Proposal *</label>

                  <textarea
                    ref={proposalRef}
                    rows={6}
                    className="w-full border rounded-md p-2 mt-1"
                    value={form.proposal}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        proposal: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        proposal: "",
                      }));
                    }}
                  />

                  {errors.proposal && (
                    <p className="text-sm text-red-500">{errors.proposal}</p>
                  )}
                </div>

                {/* ROW 6 */}
                <div className="space-y-3">
                  <label className="font-medium">Resume *</label>
                  {errors.resume && (
                    <p className="text-sm text-red-500">{errors.resume}</p>
                  )}

                  {resumes.length > 0 ? (
                    <div className="space-y-3">
                      <label className="font-medium">Choose Resume</label>

                      {resumes.map((resume) => (
                        <label
                          key={resume.id}
                          className="flex items-center justify-between rounded-lg border p-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="resume"
                              checked={selectedResumeId === resume.id}
                              onChange={() => {
                                setSelectedResumeId(resume.id);

                                // user chose an existing resume
                                setUploadedResume(null);

                                setErrors((prev) => ({
                                  ...prev,
                                  resume: "",
                                }));
                              }}
                            />

                            <div>
                              <div className="font-medium">{resume.file_name}</div>

                              {resume.is_default && (
                                <p className="text-xs text-green-600">
                                  Default Resume
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => viewResume(resume)}
                            >
                              View
                            </Button>
                          </div>
                        </label>
                      ))}

                      <div className="border-t pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload New Resume Instead
                        </Button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleResumeUpload}
                        />
                        {uploadedResume && (
                          <div className="rounded-md border border-green-200 bg-green-50 p-3 space-y-3">
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Using uploaded resume:{" "}
                                <strong>{uploadedResume.name}</strong>
                              </p>

                              <p className="text-xs text-muted-foreground">
                                This resume will only be used for this application
                                and will not be saved to your profile.
                              </p>
                            </div>

                            <div className="flex justify-center items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={viewUploadedResume}
                              >
                                View Resume
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Choose Another Resume
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {!uploadedResume ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition hover:bg-muted"
                        >
                          <Upload className="mx-auto mb-2 text-muted-foreground" />

                          <p className="text-sm font-medium">
                            Upload resume (required)
                          </p>

                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, DOCX (max 5MB)
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg border p-4 space-y-3">
                          <div>
                            <p className="font-medium">{uploadedResume.name}</p>

                            <p className="text-xs text-muted-foreground">
                              This resume will only be used for this application.
                            </p>
                          </div>

                          <div className="flex justify-center items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={viewUploadedResume}
                            >
                              View Resume
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Choose Another Resume
                            </Button>
                          </div>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleResumeUpload}
                      />
                    </>
                  )}
                </div>
              </fieldset>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={hasApplied || checkingApplication}
              >
                {checkingApplication
                  ? "Checking Application..."
                  : hasApplied
                    ? "Already Applied"
                    : "Submit Application"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
