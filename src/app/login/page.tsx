"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { useSession } from "@/lib/auth-client";
import clsx from "clsx";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const usernameInput = (
    <input
      type="text"
      name="username"
      placeholder="Username"
      className="input w-[10%] min-w-[200px] px-3 py-2 border border-gray-300 rounded-md"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
      disabled={isLoading}
    />
  );

  const passwordInput = (
    <input
      type="password"
      name="password"
      placeholder="Password"
      className="input w-[10%] min-w-[200px] px-3 py-2 border border-gray-300 rounded-md"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      disabled={isLoading}
    />
  );

  const submitButtonClassName = clsx("btn btn-success", {
    "btn-disabled": isLoading,
  });

  const submitButton = (
    <button type="submit" className={submitButtonClassName}>
      {isLoading && <span className="loading loading-spinner size-5" />}
      Login
    </button>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Error logging in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <Header session={session?.session ?? null} />

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-5">{usernameInput}</div>
        <div className="flex justify-center mb-5">{passwordInput}</div>
        {error && <div className="text-center mb-5 text-red-600">{error}</div>}
        <div className="text-center">{submitButton}</div>
      </form>

      <p className="text-center mt-5">
        Need an account? Register{" "}
        <Link href="/register" className="font-bold underline">
          here
        </Link>
        .
      </p>
    </div>
  );
}
