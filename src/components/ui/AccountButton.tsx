"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import type { ServerSession } from "@/app/actions";

interface AccountButtonProps {
  currentSession: ServerSession | null;
}

interface ModalState {
  success: boolean;
  message: string;
}

export default function AccountButton({ currentSession }: AccountButtonProps) {
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
    statusText = "Login";
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
            <div className="flex gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={modalState.success ? "green" : "red"}
                aria-hidden="true"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="py-4">{modalState.message}</p>
            </div>
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
