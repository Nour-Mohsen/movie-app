import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  Account,
  ID,
  OAuthProvider,
  type Models,
} from "react-native-appwrite";

import { AuthError } from "@/utils/authError";
import { getAppwriteErrorMessage, isExistingUserError } from "@/utils/appwriteError";
import { account } from "@/services/appwrite";

WebBrowser.maybeCompleteAuthSession();

const getOAuthRedirect = () => {
  const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
  if (!deepLink.hostname) {
    deepLink.hostname = "localhost";
  }
  return deepLink;
};

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

    // Account may already exist from a prior signup — try signing in instead.
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
  const timeoutMs = 8000;

  const withTimeout = <T>(promise: Promise<T>): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Logout timed out")), timeoutMs),
      ),
    ]);

  try {
    await withTimeout(account.deleteSession({ sessionId: "current" }));
  } catch {
    try {
      await withTimeout(account.deleteSessions());
    } catch {
      // Clear local session even if the network request fails.
    }
  }
};

export const loginWithGoogle = async (): Promise<Models.User> => {
  const redirectUri = getOAuthRedirect();
  const scheme = `${redirectUri.protocol}//`;

  const loginUrl = account.createOAuth2Token({
    provider: OAuthProvider.Google,
    success: `${redirectUri}`,
    failure: `${redirectUri}`,
  });

  if (!loginUrl) {
    throw new AuthError("Failed to start Google sign-in.");
  }

  const result = await WebBrowser.openAuthSessionAsync(
    loginUrl.toString(),
    scheme,
  );

  if (result.type !== "success" || !result.url) {
    throw new AuthError("Google sign-in was cancelled.");
  }

  const url = new URL(result.url);
  const userId = url.searchParams.get("userId");
  const secret = url.searchParams.get("secret");

  if (!userId || !secret) {
    throw new AuthError("Google sign-in failed.");
  }

  try {
    await account.createSession({ userId, secret });
    return account.get();
  } catch (error) {
    throw new AuthError(getAppwriteErrorMessage(error));
  }
};

export type { Account };
