import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { cardStyles } from "../styles/homeStyles";
import { memo } from "react";
import { Image } from "expo-image";

const MediaCard = memo(({ item }) => {
  const router = useRouter();

  const handlePress = () => {
    if (item.mediaType === "MOVIE") router.push(`/movie/${item.tmdbId}`);
    else router.push(`/tv/${item.tmdbId}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={cardStyles.card}
      activeOpacity={0.75}
    >
      <Image
        source={item.posterPath ? { uri: item.posterPath } : null}
        style={cardStyles.poster}
        contentFit="cover" // expo-image uses contentFit instead of resizeMode
        transition={200} // smooth fade in when image loads
        cachePolicy="memory-disk" // cache in memory AND on disk
      />
      <Text style={cardStyles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
});

export default MediaCard;
