import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const useSession = authClient.useSession;

export const signIn = authClient.signIn.email;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp.email;
