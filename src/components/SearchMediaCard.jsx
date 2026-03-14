import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo } from "react";
import { CARD_WIDTH } from "../styles/homeStyles";

const SearchMediaCard = memo(({ item }) => {
  const router = useRouter();
  const CARD_WIDTH = (Dimensions.get("window").width - 24) / 3;
  const handlePress = () => {
    if (item.mediaType === "MOVIE") router.push(`/movie/${item.tmdbId}`);
    else router.push(`/tv/${item.tmdbId}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.card}
      activeOpacity={0.75}
    >
      <Image
        source={item.posterPath ? { uri: item.posterPath } : null}
        style={styles.poster}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {item.mediaType === "MOVIE" ? "Movie" : "TV"}
        </Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
});

export default SearchMediaCard;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    margin: 4,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: "#1a1a2e",
  },
  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "600",
  },
  title: {
    color: "#ccc",
    fontSize: 11,
    marginTop: 6,
    marginBottom: 4,
    height: 28,
  },
});
