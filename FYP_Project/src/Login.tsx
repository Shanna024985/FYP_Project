import singpassLogin from "./assets/singpass_logo.png";
import { Button } from "./components/ui/button";
import NavigationMenus from "./NavigationMenu";

type Props = {
  currentUrl: string;
};
export default function LoginPage({ currentUrl }: Props) {
  const handleSingpassLogin = () => {
    window.location.href = `${currentUrl}/auth`;
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <NavigationMenus currentUrl={currentUrl} />
      <h1 className="text-2xl font-bold text-black! dark:text-white!">
        Login into your account
      </h1>

      <button
        onClick={handleSingpassLogin}
        aria-label="Sing pass login button"
        className="
        w-fit
          bg-[#F4333D]
          hover:bg-[#B0262D]
          text-white
          px-6 py-3
          rounded-md
          flex items-center gap-1
          transition-colors
        "
      >
        {/* LABEL (explicit 16px requirement) */}
        <span className="font-poppins text-[16px] font-bold leading-none">
          Log in with
        </span>

        {/* LOGO */}
        <img
          src={singpassLogin}
          alt="Singpass"
          aria-hidden="true"
          className="h-[13px] w-auto translate-y-[4px]"
        />
      </button>
      <p>or</p>
      <Button type="button" onClick={()=>{
        window.location.href = currentUrl+"/auth/google"
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Login with Google
      </Button>
    </div>
  );
}
