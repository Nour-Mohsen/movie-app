import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  isMovieSaved,
  removeSavedMovie,
  saveMovie,
} from "@/services/appwrite";

export type SaveMovieInput = {
  id: number;
  title: string;
  poster_path?: string;
  poster_url?: string;
};

export function useSaveMovie(movie: SaveMovieInput) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [savedRecord, setSavedRecord] = useState<SavedMovie | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshSavedState = useCallback(async () => {
    if (!user) {
      setSavedRecord(null);
      return;
    }

    try {
      const saved = await isMovieSaved(user.$id, movie.id);
      setSavedRecord(saved);
    } catch {
      setSavedRecord(null);
    }
  }, [user, movie.id]);

  useEffect(() => {
    refreshSavedState();
  }, [refreshSavedState]);

  const toggleSave = useCallback(async () => {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    setLoading(true);

    try {
      if (savedRecord) {
        await removeSavedMovie(savedRecord.$id);
        setSavedRecord(null);
        showToast(`"${movie.title}" removed from saved movies`);
      } else {
        const saved = await saveMovie(user, movie);
        setSavedRecord(saved);
        showToast(`"${movie.title}" added to saved movies`);
      }
    } catch (error) {
      console.error("Save toggle failed:", error);
      showToast("Could not update saved movies. Try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [user, savedRecord, movie, router, showToast]);

  return {
    isSaved: Boolean(savedRecord),
    loading,
    toggleSave,
  };
}
