import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getYouTubeTrailerEmbedHtml,
  WEBVIEW_EMBED_ORIGIN,
} from "@/services/api";

type TrailerPlayerProps = {
  videoKey: string;
};

const TrailerPlayer = ({ videoKey }: TrailerPlayerProps) => {
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  return (
    // Push the player below the status bar so YouTube controls stay visible.
    <View
      className="w-full bg-black"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="w-full aspect-video">
        {loading ? (
          <View className="absolute inset-0 items-center justify-center z-10">
            <ActivityIndicator color="#AB8BFF" size="large" />
          </View>
        ) : null}

        <WebView
          source={{
            html: getYouTubeTrailerEmbedHtml(videoKey),
            baseUrl: WEBVIEW_EMBED_ORIGIN,
          }}
          originWhitelist={["*"]}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          onLoadEnd={() => setLoading(false)}
          style={{ flex: 1, backgroundColor: "#000" }}
        />
      </View>
    </View>
  );
};

export default TrailerPlayer;
