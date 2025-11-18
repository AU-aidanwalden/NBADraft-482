"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    statusText = "My Account";
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
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
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
      router.push(`/user/${currentSession.user.username}`);
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
