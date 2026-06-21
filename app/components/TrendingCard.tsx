import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text, TouchableOpacity, Image } from "react-native";

import SaveMovieButton from "@/app/components/SaveMovieButton";
import { images } from "@/constants/images";

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  return (
    <View className="w-32 relative pl-5">
      <View className="relative">
        <Link href={`/movie/${movie_id}`} asChild>
          <TouchableOpacity activeOpacity={0.85}>
            <Image
              source={{ uri: poster_url }}
              className="w-32 h-48 rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Link>

        <SaveMovieButton
          movie={{ id: movie_id, title, poster_url }}
          className="absolute bottom-2 right-0 rounded-full size-9 bg-dark-100/90 items-center justify-center"
          iconClassName="size-4"
        />
      </View>

      <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full pointer-events-none">
        <MaskedView
          maskElement={
            <Text className="font-bold text-white text-6xl">{index + 1}</Text>
          }
        >
          <Image
            source={images.rankingGradient}
            className="size-14"
            resizeMode="cover"
          />
        </MaskedView>
      </View>

      <Link href={`/movie/${movie_id}`} asChild>
        <TouchableOpacity activeOpacity={0.85}>
          <Text
            className="text-sm font-bold mt-2 text-light-200"
            numberOfLines={2}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default TrendingCard;
