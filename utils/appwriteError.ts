type AppwriteErrorShape = {
  type?: string;
  code?: number;
  message?: string;
};

export const getAppwriteErrorMessage = (error: unknown): string => {
  const appwriteError = error as AppwriteErrorShape;

  if (appwriteError.type === "user_auth_method_unsupported") {
    return "Email and password sign-up is disabled in Appwrite. Enable it under Auth → Settings in your Appwrite console.";
  }

  if (appwriteError.type === "user_already_exists" || appwriteError.code === 409) {
    return "An account with this email already exists. Sign in instead.";
  }

  if (appwriteError.type === "password_recently_used") {
    return "Choose a password you have not used recently.";
  }

  if (appwriteError.type === "password_personal_data") {
    return "Password cannot contain your name or email.";
  }

  if (
    appwriteError.type === "general_password_invalid" ||
    appwriteError.message?.toLowerCase().includes("password")
  ) {
    return appwriteError.message ?? "Password does not meet Appwrite requirements.";
  }

  if (appwriteError.message) {
    return appwriteError.message;
  }

  return "Something went wrong. Please try again.";
};

export const isExistingUserError = (error: unknown) => {
  const appwriteError = error as AppwriteErrorShape;
  return (
    appwriteError.type === "user_already_exists" ||
    appwriteError.code === 409 ||
    appwriteError.message?.toLowerCase().includes("already exists") ||
    appwriteError.message?.toLowerCase().includes("already registered")
  );
};
