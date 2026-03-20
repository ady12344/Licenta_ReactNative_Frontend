import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getLibrary } from "../../src/api/api";
import SearchMediaCard from "../../src/components/SearchMediaCard";
import { libraryStyles as styles } from "../../src/styles/libraryStyles";

const TYPE_CONFIG = {
  MOVIE: { label: "My Movies" },
  TV: { label: "My TV Shows" },
};

const renderItem = ({ item }) => <SearchMediaCard item={item} />;

export default function LibraryType() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const config = TYPE_CONFIG[type];

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const isLoadingMoreRef = useRef(false);
  const backButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadInitial();
    Animated.timing(backButtonOpacity, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const { data } = await getLibrary(type, 1, 20);
      setResults(data.results);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.log("Error loading library:", e);
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
      const { data } = await getLibrary(type, nextPage, 20);
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
      <View style={styles.loadingContainer}>
        <Text style={{ color: "white" }}>Invalid type</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E50914" size="large" />
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

      {/* Header title */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>{config.label}</Text>
      </View>

      {/* Results */}
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        )}
      />
    </View>
  );
}
