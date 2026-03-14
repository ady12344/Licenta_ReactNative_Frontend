import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getPopularTv,
  getTopRatedTv,
  getOnTheAirTv,
} from "../../src/api/api";
import SearchMediaCard from "../../src/components/SearchMediaCard";

const CATEGORY_CONFIG = {
  "movie-popular": { label: "Popular Movies", fetch: getPopularMovies },
  "movie-now-playing": { label: "Now Playing", fetch: getNowPlayingMovies },
  "movie-upcoming": { label: "Upcoming Movies", fetch: getUpcomingMovies },
  "tv-popular": { label: "Popular TV Shows", fetch: getPopularTv },
  "tv-top-rated": { label: "Top Rated TV Shows", fetch: getTopRatedTv },
  "tv-on-the-air": { label: "On The Air", fetch: getOnTheAirTv },
};

const renderItem = ({ item }) => <SearchMediaCard item={item} />;

export default function CategoryScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();

  const config = CATEGORY_CONFIG[type];

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      const { data } = await config.fetch(1);
      setResults(data.results);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.log("Category load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMoreRef.current || page >= totalPages) return;
    isLoadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const { data } = await config.fetch(nextPage);
      setResults((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (e) {
      console.log("Load more error:", e);
    } finally {
      isLoadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#E50914" />
      </View>
    );
  };

  if (!config) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{config.label}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#E50914" size="large" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.mediaType}-${item.tmdbId}`}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          onEndReached={loadingMore ? null : loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={12}
          windowSize={5}
          initialNumToRender={12}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  backButton: {
    width: 40,
  },
  backArrow: {
    color: "#E50914",
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
    paddingTop: 12,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 40,
  },
});
