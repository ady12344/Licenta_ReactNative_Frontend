import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { getLibrary } from "../../src/api/api";
import MediaCard from "../../src/components/MediaCard";
import SearchMediaCard from "../../src/components/SearchMediaCard";
import { libraryStyles as styles } from "../../src/styles/libraryStyles";

export default function Library() {
  const router = useRouter();

  const [recentItems, setRecentItems] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadLibrary();
    }, []),
  );

  const loadLibrary = async () => {
    try {
      const [recentlyAdded, movieLibrary, tvLibrary] = await Promise.all([
        getLibrary(null, 1, 10),
        getLibrary("MOVIE", 1, 10),
        getLibrary("TV", 1, 10),
      ]);
      setRecentItems(recentlyAdded.data.results);
      setMovies(movieLibrary.data.results);
      setTvShows(tvLibrary.data.results);
    } catch (e) {
      console.log("Error loading the library");
      setError("Failed to load the library");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    await loadLibrary();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E50914" size="large" />
      </View>
    );
  }

  const isEmpty =
    recentItems.length === 0 && movies.length === 0 && tvShows.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E50914"
            colors={["#E50914"]}
          />
        }
      >
        {/* Header */}
        <Text style={styles.pageTitle}>My Library</Text>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your library is empty</Text>
            <Text style={styles.emptySubtext}>
              Add movies and TV shows to your library
            </Text>
          </View>
        ) : (
          <View>
            {/* Recently Added */}
            {recentItems.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { paddingHorizontal: 16, marginBottom: 12 },
                  ]}
                >
                  Recently Added
                </Text>
                <FlatList
                  data={recentItems}
                  keyExtractor={(item) =>
                    `recent-${item.mediaType}-${item.tmdbId}`
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <SearchMediaCard item={item} />}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}

            {/* Movies */}
            {movies.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Movies</Text>
                  <TouchableOpacity
                    onPress={() => router.push("/library/MOVIE")}
                  >
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={movies}
                  keyExtractor={(item) => `movie-${item.tmdbId}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <MediaCard item={item} />}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}

            {/* TV Shows */}
            {tvShows.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>TV Shows</Text>
                  <TouchableOpacity onPress={() => router.push("/library/TV")}>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={tvShows}
                  keyExtractor={(item) => `tv-${item.tmdbId}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <MediaCard item={item} />}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
