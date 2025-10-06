import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { db, dbSchema } from "./db/client";

// Use a build-time placeholder if BETTER_AUTH_SECRET is not set
const secret =
  process.env.BETTER_AUTH_SECRET ||
  "build-time-placeholder-secret-replace-at-runtime";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  secret,
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: dbSchema,
    camelCase: false,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [nextCookies(), username()],
});
