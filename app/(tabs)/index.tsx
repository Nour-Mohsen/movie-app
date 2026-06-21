import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import { useFetch } from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/app/components/SearchBar";
import MovieCard from "@/app/components/MovieCard";
import TrendingCard from "@/app/components/TrendingCard";

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const loading = moviesLoading || trendingLoading;
  const error = moviesError || trendingError;

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="flex-1 px-5"
        data={loading || error ? [] : movies ?? []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
              />
            ) : error ? (
              <Text className="text-white mt-10">
                Error: {error.message}
              </Text>
            ) : (
              <>
                <SearchBar
                  onPress={() => {
                    router.push("/search");
                  }}
                  placeholder="Search for a movie"
                />

                {trendingMovies && trendingMovies.length > 0 ? (
                  <View className="mt-10">
                    <Text className="text-lg text-white font-bold mb-3">
                      Trending Movies
                    </Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="mb-4 mt-3"
                      data={trendingMovies}
                      contentContainerStyle={{ gap: 26 }}
                      renderItem={({ item, index }) => (
                        <TrendingCard movie={item} index={index} />
                      )}
                      keyExtractor={(item) => item.movie_id.toString()}
                      ItemSeparatorComponent={() => <View className="w-4" />}
                    />
                  </View>
                ) : null}

                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Latest Movies
                </Text>
              </>
            )}
          </>
        }
        renderItem={({ item }) => <MovieCard {...item} />}
        ListEmptyComponent={
          !loading && !error ? (
            <Text className="text-gray-500 text-center mt-4">
              No movies found.
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default Index;
