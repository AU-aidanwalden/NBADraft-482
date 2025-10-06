"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import type { Session } from "better-auth/types";

interface AccountButtonProps {
  initialSession: Session | null;
}

export default function AccountButton({ initialSession }: AccountButtonProps) {
  const { data: session } = useSession();
  const currentSession = session ?? initialSession;
  const router = useRouter();

  let statusText = "";
  const buttonClassName = "btn btn-success btn-md";

  let icon: React.ReactNode;
  if (currentSession) {
    statusText = "Logout";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        {/* Heroicons: arrow-right-on-rectangle */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3.75-3h9m0 0-3-3m3 3-3 3"
        />
      </svg>
    );
  } else {
    statusText = "Login/Register";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        {/* Heroicons: user-circle */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    );
  }

  async function handleClick(_e: React.MouseEvent) {
    if (currentSession) {
      await signOut();
      router.push("/");
    } else {
      router.push("/login");
    }
  }

  return (
    <button className={buttonClassName} onClick={handleClick}>
      {icon}
      {statusText}
    </button>
  );
}
