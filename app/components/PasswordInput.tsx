import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";

interface PasswordInputProps extends TextInputProps {
  containerClassName?: string;
}

const PasswordInput = ({
  containerClassName = "mb-6",
  editable = true,
  ...props
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <View
      className={`flex-row items-center bg-dark-100 rounded-xl px-4 ${containerClassName}`}
    >
      <TextInput
        {...props}
        className="flex-1 text-white py-3.5 pr-3"
        placeholderTextColor={props.placeholderTextColor ?? "#9CA4AB"}
        secureTextEntry={!visible}
        editable={editable}
      />
      <TouchableOpacity
        onPress={() => setVisible((current) => !current)}
        disabled={!editable}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Hide password" : "Show password"}
      >
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={22}
          color="#9CA4AB"
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
