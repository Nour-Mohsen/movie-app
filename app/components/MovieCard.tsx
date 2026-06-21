import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";

import SaveMovieButton from "@/app/components/SaveMovieButton";
import { icons } from "@/constants/icons";
import { getMoviePosterUrl } from "@/utils/movie";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  return (
    <View className="w-[30%]">
      <View className="relative">
        <Link href={`/movie/${id}`} asChild>
          <TouchableOpacity activeOpacity={0.85}>
            <Image
              source={{ uri: getMoviePosterUrl(poster_path) }}
              className="w-full h-52 rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Link>

        <SaveMovieButton
          movie={{ id, title, poster_path }}
          className="absolute bottom-2 right-2 rounded-full size-9 bg-dark-100/90 items-center justify-center"
          iconClassName="size-4"
        />
      </View>

      <Link href={`/movie/${id}`} asChild>
        <TouchableOpacity activeOpacity={0.85}>
          <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
            {title}
          </Text>

          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 font-medium mt-1">
              {release_date?.split("-")[0]}
            </Text>
            <Text className="text-xs font-medium text-light-300 uppercase">
              Movie
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default MovieCard;
