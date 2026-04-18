import { TouchableOpacity, Text } from "react-native";
import { cardStyles } from "../styles/homeStyles";
import { memo } from "react";
import { Image } from "expo-image";
import { useRouter, usePathname } from 'expo-router';

const MediaCard = memo(({ item }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = () => {
    const route = item.mediaType === 'MOVIE'
        ? `/movie/${item.tmdbId}`
        : `/tv/${item.tmdbId}`;

    // if already on a detail screen, replace instead of push
    if (pathname.startsWith('/movie/') || pathname.startsWith('/tv/') || pathname.startsWith('/person/')) {
      router.replace(route);
    } else {
      router.push(route);
    }
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
