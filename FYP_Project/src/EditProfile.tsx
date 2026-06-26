import { useState } from "react";
import { Save, Upload, Plus } from "lucide-react";
import './title.css'
import { Button } from "@/components/ui/button";
import NavigationMenus from "./NavigationMenu";
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
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div>
        <NavigationMenus />
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 shadow-sm">
        {/* Header */}
        <div className="relative mb-10 flex items-center justify-center">
          <h1 className="text-3xl font-bold title-black">Edit Profile</h1>

          <Button className="absolute right-0 top-0" variant="default">
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

            <label htmlFor="profile-upload">
              <div className="absolute bottom-0 right-0 flex cursor-pointer items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs shadow-sm transition hover:bg-muted">
                <Upload className="size-3" />
                Upload Photo
              </div>
            </label>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-5">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>First Name *</InputGroupText>
            </InputGroupAddon>

            <InputGroupInput placeholder="Enter first name" />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>Last Name *</InputGroupText>
            </InputGroupAddon>

            <InputGroupInput placeholder="Enter last name" />
          </InputGroup>

          <div className="border-t pt-6" />

          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>Email *</InputGroupText>
            </InputGroupAddon>

            <InputGroupInput type="email" placeholder="Enter email" />
          </InputGroup>
        </div>

        {/* Link Profiles */}
        <div className="mt-10 border-t pt-8">
          <h2 className="mb-5 text-center text-2xl font-bold title-black">Link Profiles</h2>

          <div className="flex justify-center gap-4">
            <Button variant="outline">Link LinkedIn</Button>

            <Button variant="outline">Link Github</Button>
          </div>
        </div>

        {/* Education */}
        <div className="mt-10 border-t pt-8">
          <div className="mb-6 flex items-center justify-center gap-3">
            <h2 className="text-2xl font-bold title-black">Education</h2>

            <Button variant="outline" size="icon-sm" className="rounded-full">
              <Plus className="size-4" />
            </Button>
          </div>

          {/* Empty State */}
          <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
            No education added yet
          </div>
        </div>

        {/* Resume */}
        <div className="mt-10 border-t pt-8">
          <div className="mb-6 flex items-center justify-center gap-3">
            <h2 className="text-2xl font-bold title-black">Resume</h2>

            <Button variant="outline" size="icon-sm" className="rounded-full">
              <Plus className="size-4" />
            </Button>
          </div>

          {/* Empty State */}
          <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
            No resume uploaded yet
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
