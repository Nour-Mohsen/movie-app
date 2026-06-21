import { createElement, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getYouTubeTrailerEmbedUrl } from "@/services/api";

type TrailerPlayerProps = {
  videoKey: string;
};

const TrailerPlayer = ({ videoKey }: TrailerPlayerProps) => {
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  return (
    <View
      className="w-full bg-black"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="w-full aspect-video bg-black">
        {loading ? (
          <View className="absolute inset-0 items-center justify-center z-10">
            <ActivityIndicator color="#AB8BFF" size="large" />
          </View>
        ) : null}

        {createElement("iframe", {
          src: getYouTubeTrailerEmbedUrl(videoKey),
          title: "Movie trailer",
          allow:
            "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowFullScreen: true,
          onLoad: () => setLoading(false),
          style: {
            width: "100%",
            height: "100%",
            border: "none",
            backgroundColor: "#000",
          },
        })}
      </View>
    </View>
  );
};

export default TrailerPlayer;
