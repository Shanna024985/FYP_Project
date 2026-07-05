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
  useEffect(() => {
    if (resumes.length === 0) return;

    const defaultResume = resumes.find((r) => r.is_default);

    if (defaultResume) {
      setSelectedResumeId(defaultResume.id);
    } else {
      setSelectedResumeId(resumes[0].id);
    }
  }, [resumes]);

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axios.post(`${currentUrl}/resumes/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Resume uploaded successfully.");

      // Refresh resume list
      const res = await axios.get(`${currentUrl}/resumes/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResumes(res.data.resumes);

      // Select newest uploaded resume
      const resumes = res.data.resumes as Resume[];

      setResumes(resumes);

      const uploadedResume = resumes.reduce<Resume>(
        (latest, current) => (current.id > latest.id ? current : latest),
        resumes[0],
      );

      setSelectedResumeId(uploadedResume.id);

      setErrors((prev) => ({
        ...prev,
        resume: "",
      }));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Upload failed.");
    }
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

      resume: selectedResumeId ? "" : "Please select or upload a resume.",
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
      const res = await axios.post(
        `${currentUrl}/jobs/${job.id}/apply`,
        {
          resumeId: selectedResumeId,
          fullname: form.name,
          email: form.email,
          phone: form.phone,
          proposal: form.proposal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);
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
          tags={[job.category, job.type]}
          date={new Date(job.created_at).toLocaleDateString("en-SG")}
          companyLogo={`data:image/png;base64,${company?.logo_base64 ?? ""}`}
        />

        <Card>
          <CardContent className="space-y-5">
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
                  </div>
                </div>
              ) : (
                <>
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

            <Button className="w-full" onClick={handleSubmit}>
              Submit Application
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
