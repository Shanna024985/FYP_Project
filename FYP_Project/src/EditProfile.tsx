import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Save, Upload, Plus } from "lucide-react";
import "./title.css";
import { Button } from "@/components/ui/button";
import NavigationMenus from "./NavigationMenu";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
type Props = {
  currentUrl: string;
};
export default function EditProfilePage({ currentUrl }: Props) {
  type Resume = {
    id: number;
    user_id: number;
    file_name: string;
    file_data: string;
    is_default: boolean;
  };

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    linkedin_profile: "",
    github_profile: "",
  });
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null); 
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    linkedin_profile: "",
    github_profile: "",
  });

  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProfile();
    fetchResumes();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

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
        linkedin_profile: res.data.profile.linkedin_profile || "",
        github_profile: res.data.profile.github_profile || "",
      });
      const profileData = res.data.profile;
      if (profileData.profile_picture_url) {
        setProfileImage(profileData.profile_picture_url);
      } else {
        setProfileImage(null);
      }
      setHasProfile(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No profile exists yet
        setHasProfile(false);

        setProfile({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          linkedin_profile: "",
          github_profile: "",
        });
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "first_name" || name === "last_name" || name === "email") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (
      name === "first_name" ||
      name === "last_name" ||
      name === "email" ||
      name === "phone_number" ||
      name === "linkedin_profile" ||
      name === "github_profile"
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Preview immediately
    setProfileImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profile", file); // <-- must match multer field name

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${currentUrl}/user/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Replace preview with Cloudinary URL
      setProfileImage(res.data.profile_picture_url);

      toast.success("Profile photo uploaded successfully.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to upload profile photo.",
      );
    }
  };
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const handleSave = async () => {
    const newErrors = {
      first_name: profile.first_name.trim() ? "" : "First name is required.",

      last_name: profile.last_name.trim() ? "" : "Last name is required.",

      email: !profile.email.trim()
        ? "Email is required."
        : !isValidEmail(profile.email)
          ? "Please enter a valid email address."
          : "",
      phone_number: profile.phone_number.trim()
        ? ""
        : "Phone number is required.",

      linkedin_profile:
        profile.linkedin_profile && !isValidUrl(profile.linkedin_profile)
          ? "Please enter a valid URL."
          : "",

      github_profile:
        profile.github_profile && !isValidUrl(profile.github_profile)
          ? "Please enter a valid URL."
          : "",
    };

    setErrors(newErrors);

    if (newErrors.first_name) {
      firstNameRef.current?.focus();
      return;
    }

    if (newErrors.last_name) {
      lastNameRef.current?.focus();
      return;
    }

    if (newErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (newErrors.phone_number) {
      phoneRef.current?.focus();
      return;
    }

    const token = localStorage.getItem("token");

    try {
      let res;

      if (hasProfile) {
        res = await axios.put(`${currentUrl}/user/profile`, profile, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        res = await axios.post(`${currentUrl}/user/profile`, profile, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasProfile(true);
      }

      setProfile({
        first_name: res.data.profile.first_name || "",
        last_name: res.data.profile.last_name || "",
        email: res.data.profile.email || "",
        phone_number: res.data.profile.phone_number || "",
        linkedin_profile: res.data.profile.linkedin_profile || "",
        github_profile: res.data.profile.github_profile || "",
      });

      toast.success("Profile saved successfully.");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save profile.");
    }
  };
  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${currentUrl}/resumes/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Resume API response:", res.data);

      setResumes(res.data.resumes);
    } catch (err) {
      console.error(err);
    }
  };
  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${currentUrl}/resumes/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchResumes();

      toast.success("Resume uploaded successfully.");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Upload failed.");
    }
  };
  const handleSetDefault = async (resumeId: number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${currentUrl}/resumes/${resumeId}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchResumes();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to set default resume.");
    }
  };
  const handleDeleteResume = async (resumeId: number) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${currentUrl}/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchResumes();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete resume.");
    }
  };
  const handleViewResume = (resume: Resume) => {
    const byteCharacters = atob(resume.file_data);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };
  const handleDownloadResume = (resume: Resume) => {
    const byteCharacters = atob(resume.file_data);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = resume.file_name;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };
  const handleDeleteProfilePhoto = async () => {
    if (!window.confirm("Delete your profile photo?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${currentUrl}/user/profile/photo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileImage(null);

      // Reset file input so the same image can be selected again
      if (profileInputRef.current) {
        profileInputRef.current.value = "";
      }

      toast.success("Profile photo deleted successfully.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to delete profile photo.",
      );
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <NavigationMenus currentUrl={currentUrl}/>
      <div className="min-h-screen bg-background px-6 py-8">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 shadow-sm">
          {/* Header */}
          <div className="relative mb-10 flex items-center justify-center">
            <h1 className="text-3xl font-bold title-black">Edit Profile</h1>

            <Button
              className="absolute right-0 top-0"
              variant="default"
              onClick={handleSave}
            >
              <Save className="size-4" />
              Save
            </Button>
          </div>

          {/* Profile Picture */}
          <div className="mb-10 flex flex-col items-center">
            <div className="relative">
              <div className="size-36 overflow-hidden rounded-full border-4 border-muted bg-muted">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No Photo
                  </div>
                )}
              </div>

              <input
                id="profile-upload"
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => profileInputRef.current?.click()}
              >
                <Upload className="mr-2 size-4" />
                Upload Photo
              </Button>

              {profileImage && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteProfilePhoto}
                >
                  Delete Photo
                </Button>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-5">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>First Name *</InputGroupText>
              </InputGroupAddon>

              <InputGroupInput
                ref={firstNameRef}
                name="first_name"
                value={profile.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </InputGroup>

            {errors.first_name && (
              <p className="text-sm text-red-500">{errors.first_name}</p>
            )}

            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>Last Name *</InputGroupText>
              </InputGroupAddon>

              <InputGroupInput
                ref={lastNameRef}
                name="last_name"
                value={profile.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </InputGroup>

            {errors.last_name && (
              <p className="text-sm text-red-500">{errors.last_name}</p>
            )}

            <div className="border-t pt-6" />

            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>Email *</InputGroupText>
              </InputGroupAddon>

              <InputGroupInput
                ref={emailRef}
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </InputGroup>

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>Phone Number</InputGroupText>
              </InputGroupAddon>

              <InputGroupInput
                ref={phoneRef}
                name="phone_number"
                type="tel"
                value={profile.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </InputGroup>
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number}</p>
            )}
          </div>

          {/* Link Profiles */}
          <div className="mt-10 border-t pt-8">
            <h2 className="mb-5 text-center text-2xl font-bold title-black">
              Link Profiles
            </h2>

            <div className="space-y-5">
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>LinkedIn</InputGroupText>
                </InputGroupAddon>

                <InputGroupInput
                  name="linkedin_profile"
                  type="url"
                  value={profile.linkedin_profile}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
              </InputGroup>

              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>GitHub</InputGroupText>
                </InputGroupAddon>

                <InputGroupInput
                  name="github_profile"
                  type="url"
                  value={profile.github_profile}
                  onChange={handleChange}
                  placeholder="https://github.com/your-username"
                />
              </InputGroup>
            </div>
          </div>

          {/* Education */}
          {/* <div className="mt-10 border-t pt-8">
            <div className="mb-6 flex items-center justify-center gap-3">
              <h2 className="text-2xl font-bold title-black">Education</h2>

              <Button variant="outline" size="icon-sm" className="rounded-full">
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No education added yet
            </div>
          </div> */}
           
          {/* Resume */}
          <div className="mt-10 border-t pt-8">
            <div className="mb-6 flex items-center justify-center gap-3">
              <h2 className="text-2xl font-bold title-black">Resume</h2>

              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full"
                onClick={() => resumeInputRef.current?.click()}
              >
                <Plus className="size-4" />
              </Button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeUpload}
              />
            </div>

            {/* Empty State */}
            {resumes.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                No resume uploaded yet
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-medium">{resume.file_name}</p>

                      {resume.is_default && (
                        <p className="text-sm text-green-600">Default Resume</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!resume.is_default && (
                        <Button
                          variant="outline"
                          onClick={() => handleSetDefault(resume.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        onClick={() => handleViewResume(resume)}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDownloadResume(resume)}
                      >
                        Download
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteResume(resume.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
