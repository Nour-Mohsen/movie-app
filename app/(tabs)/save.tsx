import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import SavedMovieCard from "@/app/components/SavedMovieCard";
import { useAuth } from "@/context/AuthContext";
import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/appwrite";

const SavedMoviesScreen = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadSavedMovies = useCallback(
    async (isBackgroundRefresh = false) => {
      if (!user) {
        setSavedMovies([]);
        setInitialLoading(false);
        setRefreshing(false);
        return;
      }

      if (isBackgroundRefresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      try {
        const movies = await getSavedMovies(user.$id);
        setSavedMovies(movies);
      } catch {
        setSavedMovies([]);
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useFocusEffect(
    useCallback(() => {
      loadSavedMovies(hasLoadedRef.current);
      hasLoadedRef.current = true;
    }, [loadSavedMovies]),
  );

  if (authLoading) {
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
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-white text-xl font-bold text-center">
            Sign in to save movies
          </Text>
          <Text className="text-gray-500 text-base text-center">
            Your saved movies will appear here once you are logged in.
          </Text>
          <TouchableOpacity
            className="bg-accent rounded-xl px-8 py-3.5 mt-2"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold text-base">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-5">
      <Text className="text-white text-2xl font-bold mt-4 mb-6">
        Saved Movies
      </Text>

      {initialLoading && savedMovies.length === 0 ? (
        <ActivityIndicator color="#AB8BFF" className="mt-10" />
      ) : savedMovies.length > 0 ? (
        <FlatList
          data={savedMovies}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadSavedMovies(true)}
              tintColor="#AB8BFF"
            />
          }
          renderItem={({ item }) => <SavedMovieCard movie={item} />}
        />
      ) : (
        <View className="flex-1 items-center justify-center gap-3">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-gray-500 text-base text-center px-4">
            No saved movies yet. Tap the save icon on any movie to add it here.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SavedMoviesScreen;
