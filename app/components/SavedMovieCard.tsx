import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const SavedMovieCard = ({ movie }: { movie: SavedMovie }) => {
  return (
    <Link href={`/movie/${movie.movie_id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri:
              movie.poster_url ||
              "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {movie.title}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1 uppercase">
            Saved
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default SavedMovieCard;
