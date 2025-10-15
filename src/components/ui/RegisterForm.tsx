"use client";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitButtonClassName = clsx("btn btn-success", {
    "btn-disabled": isLoading,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Error registering user");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input w-[10%] min-w-[200px] px-3 py-2 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-center mb-5">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input w-[10%] min-w-[200px] px-3 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {error && <div className="text-center mb-5 text-red-600">{error}</div>}
        <div className="text-center">
          <button type="submit" className={submitButtonClassName}>
            {isLoading && <span className="loading loading-spinner size-5" />}
            Register
          </button>
        </div>
      </form>

      <p className="text-center mt-5">
        Already have an account? Login{" "}
        <Link href="/login" className="font-bold underline">
          here
        </Link>
        .
      </p>
    </>
  );
}
