import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTvDetails } from "../../src/api/api";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MediaCard from "../../src/components/MediaCard";

export default function TvDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadShow();
    Animated.timing(backButtonOpacity, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadShow = async () => {
    try {
      const { data } = await getTvDetails(id);
      setShow(data);
    } catch (e) {
      console.log("TV detail error:", e);
      setError("Failed to load TV show details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E50914" size="large" />
      </View>
    );
  }

  if (error || !show) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || "TV show not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky back button */}
      <Animated.View
        style={[
          styles.backButton,
          { top: insets.top + 8, opacity: backButtonOpacity },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButtonInner}
        >
          <Ionicons name="chevron-back" size={32} color="#E50914" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop */}
        <View style={styles.backdropContainer}>
          {show.backdropPath ? (
            <Image
              source={{ uri: show.backdropPath }}
              style={styles.backdrop}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.backdropPlaceholder}>
              <Ionicons name="tv-outline" size={48} color="#333" />
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(15,15,15,0.8)", "#0f0f0f"]}
            style={styles.backdropGradient}
          />
        </View>

        {/* Poster + Info */}
        <View style={styles.infoRow}>
          {show.posterPath ? (
            <Image
              source={{ uri: show.posterPath }}
              style={styles.poster}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.posterPlaceholder}>
              <Ionicons name="tv-outline" size={36} color="#333" />
            </View>
          )}
          <View style={styles.infoText}>
            <Text style={styles.title}>{show.title}</Text>
            {show.firstAirDate && (
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color="#9ca3af" />
                <Text style={styles.meta}>
                  {" "}
                  {show.firstAirDate.substring(0, 4)}
                </Text>
              </View>
            )}
            {show.tmdbRating && (
              <View style={styles.metaRow}>
                <Ionicons name="star" size={13} color="#fbbf24" />
                <Text style={styles.rating}> {show.tmdbRating.toFixed(1)}</Text>
              </View>
            )}
            {show.numberOfSeasons && (
              <View style={styles.metaRow}>
                <Ionicons name="layers-outline" size={13} color="#9ca3af" />
                <Text style={styles.meta}>
                  {" "}
                  {show.numberOfSeasons}{" "}
                  {show.numberOfSeasons === 1 ? "Season" : "Seasons"}
                </Text>
              </View>
            )}
            {show.status && (
              <View style={styles.metaRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={13}
                  color="#9ca3af"
                />
                <Text style={styles.status}> {show.status}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Genres */}
          {show.genres && show.genres.length > 0 && (
            <View style={styles.genreRow}>
              {show.genres.map((genre, index) => (
                <View key={index} style={styles.genreChip}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Overview */}
          {show.overview && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.overview}>{show.overview}</Text>
            </View>
          )}

          {/* Director */}
          {show.directorName && show.directorName !== "Unknown Director" && (
            <View style={styles.section}>
              <View style={styles.directorRow}>
                <Ionicons name="videocam-outline" size={16} color="#9ca3af" />
                <Text style={styles.sectionTitle}> Director</Text>
              </View>
              <Text style={styles.directorName}>{show.directorName}</Text>
            </View>
          )}

          {/* Cast */}
          {show.topCast && show.topCast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                data={show.topCast}
                keyExtractor={(item, index) => `cast-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.castCard}>
                    {item.profile_path ? (
                      <Image
                        source={{ uri: item.profile_path }}
                        style={styles.castImage}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="memory-disk"
                      />
                    ) : (
                      <View style={styles.castImagePlaceholder}>
                        <Ionicons
                          name="person-outline"
                          size={28}
                          color="#333"
                        />
                      </View>
                    )}
                    <Text style={styles.castName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    {item.roles && item.roles.length > 0 && (
                      <Text style={styles.castCharacter} numberOfLines={2}>
                        {item.roles[0].character}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          )}

          {/* Similar Shows */}
          {show.similarShows && show.similarShows.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Shows</Text>
              <FlatList
                data={show.similarShows}
                keyExtractor={(item) => `similar-${item.tmdbId}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <MediaCard item={item} />}
              />
            </View>
          )}

          {/* Recommended */}
          {show.recommendations && show.recommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended</Text>
              <FlatList
                data={show.recommendations}
                keyExtractor={(item) => `rec-${item.tmdbId}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <MediaCard item={item} />}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
  },
  backButtonInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backdropContainer: {
    height: 220,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  backdropPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  backdropGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -60,
    marginBottom: 16,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#1a1a2e",
  },
  posterPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 60,
    justifyContent: "flex-end",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  meta: {
    color: "#9ca3af",
    fontSize: 13,
  },
  rating: {
    color: "#fbbf24",
    fontSize: 13,
  },
  status: {
    color: "#9ca3af",
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(229,9,20,0.15)",
    borderWidth: 1,
    borderColor: "rgba(229,9,20,0.3)",
  },
  genreText: {
    color: "#E50914",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  directorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  overview: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 22,
  },
  directorName: {
    color: "#9ca3af",
    fontSize: 14,
  },
  castCard: {
    width: 80,
    marginRight: 12,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    marginBottom: 6,
  },
  castImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  castName: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
  castCharacter: {
    color: "#9ca3af",
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
});
