import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
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
      className="bg-white rounded-xl py-3.5 mb-6 flex-row items-center justify-center gap-3 border border-[#DADCE0]"
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#3C4043" />
      ) : (
        <>
          <Image
            source={icons.google}
            className="w-5 h-5"
            resizeMode="contain"
          />
          <Text className="text-[#3C4043] font-medium text-base">Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
