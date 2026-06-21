import "react-native-url-polyfill/auto";

import { Stack } from "expo-router";
import { StatusBar } from "react-native";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

import "./globals.css";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StatusBar hidden={true} />

        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </ToastProvider>
  );
}
