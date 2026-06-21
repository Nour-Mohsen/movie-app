import { ID, type Models } from "appwrite";

import { AuthError } from "@/utils/authError";
import { getAppwriteErrorMessage, isExistingUserError } from "@/utils/appwriteError";
import { account } from "@/services/appwrite";

export const getCurrentUser = async (): Promise<Models.User | null> => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<Models.User> => {
  try {
    await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });
  } catch (error) {
    if (!isExistingUserError(error)) {
      throw new AuthError(getAppwriteErrorMessage(error));
    }

    try {
      await account.createEmailPasswordSession({ email, password });
      return account.get();
    } catch {
      throw new AuthError(
        "An account with this email already exists. Sign in instead.",
        "user_already_exists",
      );
    }
  }

  await account.createEmailPasswordSession({ email, password });
  return account.get();
};

export const login = async (
  email: string,
  password: string,
): Promise<Models.User> => {
  try {
    await account.createEmailPasswordSession({ email, password });
    return account.get();
  } catch (error) {
    throw new AuthError(getAppwriteErrorMessage(error), "invalid_credentials");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch {
    try {
      await account.deleteSessions();
    } catch {
      // Clear local session even if the network request fails.
    }
  }
};

export const loginWithGoogle = async (): Promise<Models.User> => {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const redirectUrl = `${origin}/login`;

  account.createOAuth2Session("google", redirectUrl, redirectUrl);

  throw new AuthError("Redirecting to Google sign-in...");
};

/** Complete OAuth when Appwrite redirects back with userId + secret in the URL. */
export const completeOAuthIfNeeded = async (): Promise<Models.User | null> => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const secret = params.get("secret");

  if (!userId || !secret) return null;

  try {
    await account.createSession({ userId, secret });
    window.history.replaceState({}, "", window.location.pathname);
    return account.get();
  } catch (error) {
    throw new AuthError(getAppwriteErrorMessage(error));
  }
};

export type { Models };
