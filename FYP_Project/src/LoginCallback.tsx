import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export default function LoginCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const onboardingNeeded = searchParams.get("onboardingNeeded");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    if (onboardingNeeded === "true") {
      navigate("/profile");   //Login sucess for first time user, redirect to onboarding page
    } else {
      navigate("/jobSeeker/Dashboard");  //Login success for returning user, redirect to jobseeker dashboard
    }
  }, [searchParams, navigate]);

  return <div>Logging in...</div>;
}
