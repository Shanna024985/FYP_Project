export type Role = "jobseeker" | "employer";

export interface AuthState {
  token: string;
  role: Role;
}