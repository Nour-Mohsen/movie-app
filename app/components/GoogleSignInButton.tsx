import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { icons } from "@/constants/icons";

type GoogleSignInButtonProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const GoogleSignInButton = ({
  onPress,
  loading = false,
  disabled = false,
}: GoogleSignInButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl py-3 mb-4 flex-row items-center justify-center gap-2 border border-[#DADCE0]"
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#3C4043" />
      ) : (
        <>
          <View className="w-5 h-5 items-center justify-center overflow-hidden">
            <Image
              source={icons.google}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-[#3C4043] font-medium text-base">Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
