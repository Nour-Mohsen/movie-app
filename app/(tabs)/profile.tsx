import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { icons } from "@/constants/icons";

const Profile = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
    } catch {
      // Auth context clears local user state even if the request fails.
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator color="#AB8BFF" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.person} className="size-10" tintColor="#fff" />
          <Text className="text-white text-xl font-bold">Profile</Text>
          <Text className="text-gray-500 text-base text-center">
            Sign in to manage your account
          </Text>
          <TouchableOpacity
            className="bg-accent rounded-xl px-8 py-3.5 w-full items-center"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold text-base">Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-dark-100 rounded-xl px-8 py-3.5 w-full items-center"
            onPress={() => router.push("/(auth)/register")}
          >
            <Text className="text-white font-semibold text-base">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-4">
        <Image source={icons.person} className="size-10" tintColor="#fff" />
        <Text className="text-white text-2xl font-bold">
          {user.name || "User"}
        </Text>
        <Text className="text-gray-500 text-base">{user.email}</Text>

        <TouchableOpacity
          className="bg-dark-100 rounded-xl px-8 py-3.5 w-full items-center mt-6"
          onPress={handleLogout}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
