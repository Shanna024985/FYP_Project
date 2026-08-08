// AuthLayout.tsx

import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const loggedIn = !!localStorage.getItem("token");

  if (!loggedIn) return <>{children}</>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}