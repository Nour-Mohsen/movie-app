import {
  Account,
  Client,
  Databases,
  ID,
  Permission,
  Query,
  Role,
} from "react-native-appwrite";
import type { Models } from "react-native-appwrite";

import { getMoviePosterUrl } from "@/utils/movie";

export const APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
export const APPWRITE_PLATFORM = "com.anonymous.app";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const METRICS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(APPWRITE_PLATFORM);

export const account = new Account(client);
export const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION_ID,
      [Query.equal("searchTerm", query)],
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        METRICS_COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        },
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        METRICS_COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: getMoviePosterUrl(movie.poster_path),
        },
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")],
    );

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getSavedMovies = async (
  userId: string,
): Promise<SavedMovie[]> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );

    const movies = result.documents as unknown as SavedMovie[];

    return movies.sort((a, b) => {
      const aTime = a.saved_at ? new Date(a.saved_at).getTime() : 0;
      const bTime = b.saved_at ? new Date(b.saved_at).getTime() : 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Failed to load saved movies:", error);
    return [];
  }
};

export const isMovieSaved = async (
  userId: string,
  movieId: number,
): Promise<SavedMovie | null> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("movie_id", movieId)],
    );

    if (result.documents.length === 0) return null;
    return result.documents[0] as unknown as SavedMovie;
  } catch (error) {
    console.error("Failed to check saved movie:", error);
    return null;
  }
};

export const saveMovie = async (
  user: Models.User,
  movie: Pick<Movie, "id" | "title"> & {
    poster_path?: string;
    poster_url?: string;
  },
): Promise<SavedMovie> => {
  const posterUrl = movie.poster_url ?? getMoviePosterUrl(movie.poster_path);

  try {
    const document = await database.createDocument(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        movie_id: movie.id,
        title: movie.title,
        poster_url: posterUrl,
        saved_at: new Date().toISOString(),
      },
      // Only the owner can read, update, or delete their saved movie.
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ],
    );

    return document as unknown as SavedMovie;
  } catch (error: unknown) {
    const appwriteError = error as { code?: number; type?: string };
    if (
      appwriteError.code === 409 ||
      appwriteError.type === "document_already_exists"
    ) {
      const existing = await isMovieSaved(user.$id, movie.id);
      if (existing) return existing;
    }
    throw error;
  }
};

export const removeSavedMovie = async (documentId: string): Promise<void> => {
  await database.deleteDocument(
    DATABASE_ID,
    SAVED_COLLECTION_ID,
    documentId,
  );
};
