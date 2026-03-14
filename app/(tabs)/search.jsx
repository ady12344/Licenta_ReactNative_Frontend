import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { search, discover } from "../../src/api/api";
import { searchStyles } from "../../src/styles/homeStyles";
import SearchMediaCard from "../../src/components/SearchMediaCard";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 99, name: "Documentary" },
  { id: 14, name: "Fantasy" },
];

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "movie", label: "Movies" },
  { key: "tv", label: "TV Shows" },
];

const renderItem = ({ item }) => <SearchMediaCard item={item} />;

export default function Search() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef(null);
  const searchIdRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const handleSearch = async (q, type, genres) => {
    const currentId = ++searchIdRef.current;

    setResults([]);
    setPage(1);
    setLoading(true);
    setError(null);
    isLoadingMoreRef.current = false;

    try {
      let data;
      if (q) {
        const res = await search(q, type, 1);
        data = res.data;
      } else {
        const res = await discover(type, genres, 1);
        data = res.data;
      }

      if (currentId !== searchIdRef.current) return;
      setResults(data.results);
      setTotalPages(data.totalPages);
    } catch (e) {
      if (currentId !== searchIdRef.current) return;
      console.log("Search error:", e);
      setError("Failed to load results.");
    } finally {
      if (currentId !== searchIdRef.current) return;
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMoreRef.current) return;
    if (loadingMore) return;
    if (page >= totalPages) return;
    if (results.length === 0) return;

    isLoadingMoreRef.current = true;
    setLoadingMore(true);

    const type = filter === "ALL" ? null : filter;
    const genres = selectedGenres.length > 0 ? selectedGenres.join(",") : null;
    const nextPage = page + 1;

    try {
      if (query) {
        const { data } = await search(query, type, nextPage);
        setResults((prev) => [...prev, ...data.results]);
      } else {
        const { data } = await discover(type, genres, nextPage);
        setResults((prev) => [...prev, ...data.results]);
      }
      setPage(nextPage);
    } catch (e) {
      console.log("Load more error:", e);
    } finally {
      isLoadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
  };

  useEffect(() => {
    const type = filter === "ALL" ? null : filter;
    const genres = selectedGenres.length > 0 ? selectedGenres.join(",") : null;
    handleSearch(query, type, genres);
  }, [filter, selectedGenres]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const type = filter === "ALL" ? null : filter;
      const genres =
        selectedGenres.length > 0 ? selectedGenres.join(",") : null;
      handleSearch(query, type, genres);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={searchStyles.footerLoader}>
        <ActivityIndicator color="#E50914" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={searchStyles.emptyContainer}>
        <Text style={searchStyles.emptyText}>
          {query ? "No results found" : "Search for movies & TV shows"}
        </Text>
        <Text style={searchStyles.emptySubtext}>
          {query ? "Try a different search term" : "Or select genres to browse"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={searchStyles.container}>
      {/* Search bar */}
      <TouchableOpacity
        style={[
          searchStyles.searchBarContainer,
          focused && searchStyles.searchBarFocused,
        ]}
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <Text style={searchStyles.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={(text) => {
            if (text) setSelectedGenres([]);
            setQuery(text);
          }}
          placeholder="Search movies & TV shows..."
          placeholderTextColor="#555"
          style={searchStyles.searchInput}
          autoCapitalize="none"
          returnKeyType="search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery("")}
            style={searchStyles.clearButton}
          >
            <Text style={searchStyles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Filter tabs */}
      <View style={searchStyles.filterContainer}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[
              searchStyles.filterButton,
              filter === f.key && searchStyles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                searchStyles.filterText,
                filter === f.key && searchStyles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Genre chips — only when no query */}
      {!query && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={searchStyles.genreContainer}
          style={{ height: 44 }}
        >
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              onPress={() => toggleGenre(genre.id)}
              style={[
                searchStyles.genreChip,
                selectedGenres.includes(genre.id) &&
                  searchStyles.genreChipActive,
              ]}
            >
              <Text
                style={[
                  searchStyles.genreText,
                  selectedGenres.includes(genre.id) &&
                    searchStyles.genreTextActive,
                ]}
              >
                {genre.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Error */}
      {error && (
        <View style={searchStyles.errorContainer}>
          <Text style={searchStyles.errorText}>{error}</Text>
        </View>
      )}

      {/* Loading */}
      {loading ? (
        <View style={searchStyles.loadingContainer}>
          <ActivityIndicator color="#E50914" size="large" />
        </View>
      ) : (
        <FlatList
          key={query}
          data={results}
          keyExtractor={(item, index) =>
            `${item.mediaType}-${item.tmdbId}-${index}`
          }
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={searchStyles.gridContent}
          onEndReached={loadingMore ? null : loadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={renderEmpty}
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
