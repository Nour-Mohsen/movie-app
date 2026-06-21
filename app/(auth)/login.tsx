import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/app/components/PasswordInput";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { AuthError } from "@/utils/authError";

const Login = () => {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      await loginWithGoogle();
      router.replace("/");
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const busy = submitting || googleLoading;

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={icons.logo} className="w-12 h-10 mb-8 mx-auto" />

          <Text className="text-white text-3xl font-bold text-center">
            Welcome back
          </Text>
          <Text className="text-light-200 text-base text-center mt-2 mb-8">
            Sign in to save your favorite movies
          </Text>

          {error ? (
            <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>
          ) : null}

          <TextInput
            className="bg-dark-100 text-white rounded-xl px-4 py-3.5 mb-4"
            placeholder="Email"
            placeholderTextColor="#9CA4AB"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!busy}
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            editable={!busy}
          />

          <TouchableOpacity
            className="bg-accent rounded-xl py-3.5 items-center mb-4"
            onPress={handleLogin}
            disabled={busy}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">Sign In</Text>
            )}
          </TouchableOpacity>

          <GoogleSignInButton
            onPress={handleGoogleLogin}
            loading={googleLoading}
            disabled={busy}
          />

          <View className="flex-row justify-center">
            <Text className="text-light-200">Don&apos;t have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity disabled={busy}>
                <Text className="text-accent font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
