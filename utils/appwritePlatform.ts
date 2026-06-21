import { Platform } from "react-native";

const NATIVE_PLATFORM = "com.anonymous.app";

/** Appwrite validates requests against registered platform hostnames. */
export const getAppwritePlatform = (): string => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location.hostname) {
      return window.location.hostname;
    }
    return "localhost";
  }

  return NATIVE_PLATFORM;
};
