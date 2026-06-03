import singpassLogin from "./assets/singpass_logo.png";
import NavigationMenus from "./NavigationMenu";
import './title.css'
type Props = {
  currentUrl: string;
};
export default function LoginPage({ currentUrl }: Props) {
  const handleSingpassLogin = () => {
    window.location.href = `${currentUrl}/auth`;
  };

  return (
    <div className="flex flex-col gap-6 items-center">
        <NavigationMenus />
      <h1 className="text-2xl font-bold title-black">Login into your account</h1>

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
        <span
          className="font-poppins text-[16px] font-bold leading-none"
        >
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
    </div>
  );
}