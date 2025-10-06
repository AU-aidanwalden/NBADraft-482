"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import type { Session } from "better-auth/types";

interface AccountButtonProps {
  initialSession: Session | null;
}

interface ModalState {
  success: boolean;
  message: string;
}

export default function AccountButton({ initialSession }: AccountButtonProps) {
  const { data: session } = useSession();
  const currentSession = session ?? initialSession;
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState | null>(null);

  useEffect(() => {
    if (modalState) {
      const modalElement = document.getElementById(
        "account-status-modal"
      ) as HTMLDialogElement;
      if (modalElement) {
        modalElement.showModal();
      }
    }
  }, [modalState]);

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
      const result = await signOut();
      if (!result.error) {
        setModalState({ success: true, message: "Logged out successfully." });
        router.refresh();
      } else {
        setModalState({
          success: false,
          message: result.error.message || "Error logging out.",
        });
      }
    } else {
      router.push("/login");
    }
  }

  return (
    <>
      {modalState && (
        <dialog id="account-status-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {modalState.success ? "Success" : "Error"}
            </h3>
            <p className="py-4">{modalState.message}</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-neutral">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
      <button className={buttonClassName} onClick={handleClick}>
        {icon}
        {statusText}
      </button>
    </>
  );
}
