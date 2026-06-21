import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";

import { icons } from "@/constants/icons";
import {
  useSaveMovie,
  type SaveMovieInput,
} from "@/hooks/useSaveMovie";

type SaveMovieButtonProps = {
  movie: SaveMovieInput;
  className?: string;
  iconClassName?: string;
};

const SaveMovieButton = ({
  movie,
  className = "absolute bottom-2 right-2 rounded-full size-9 bg-dark-100/90 items-center justify-center",
  iconClassName = "size-4",
}: SaveMovieButtonProps) => {
  const { isSaved, loading, toggleSave } = useSaveMovie(movie);

  return (
    <TouchableOpacity
      className={className}
      onPress={toggleSave}
      disabled={loading}
      hitSlop={8}
    >
      {loading ? (
        <ActivityIndicator color="#AB8BFF" size="small" />
      ) : (
        <Image
          source={icons.save}
          className={iconClassName}
          tintColor={isSaved ? "#AB8BFF" : "#fff"}
        />
      )}
    </TouchableOpacity>
  );
};

export default SaveMovieButton;
