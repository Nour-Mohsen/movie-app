import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

import { AuthError } from "@/utils/authError";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/app/components/PasswordInput";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Register = () => {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || password.length < 8) {
      setError("Name, email, and a password of at least 8 characters are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await register(email.trim(), password, name.trim());
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else if (error instanceof Error && error.message) {
        setError(error.message);
      } else {
        setError(
          "Could not create account. Check your details and try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

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
            Create account
          </Text>
          <Text className="text-light-200 text-base text-center mt-2 mb-8">
            Join to save movies to your list
          </Text>

          {error ? (
            <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>
          ) : null}

          <TextInput
            className="bg-dark-100 text-white rounded-xl px-4 py-3.5 mb-4"
            placeholder="Name"
            placeholderTextColor="#9CA4AB"
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />

          <TextInput
            className="bg-dark-100 text-white rounded-xl px-4 py-3.5 mb-4"
            placeholder="Email"
            placeholderTextColor="#9CA4AB"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!submitting}
          />

          <PasswordInput
            placeholder="Password (min. 8 characters)"
            value={password}
            onChangeText={setPassword}
            editable={!submitting}
          />

          <TouchableOpacity
            className="bg-accent rounded-xl py-3.5 items-center mb-6"
            onPress={handleRegister}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">Sign Up</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-light-200">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity disabled={submitting}>
                <Text className="text-accent font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
