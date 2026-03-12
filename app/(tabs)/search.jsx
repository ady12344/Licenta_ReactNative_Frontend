import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect, useMemo, useRef } from "react";
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

  const genresString = useMemo(
    () => (selectedGenres.length > 0 ? selectedGenres.join(",") : null),
    [selectedGenres],
  );

  const typeParam = filter === "ALL" ? null : filter;

  const handleSearch = async () => {
    setResults([]);
    setPage(1);
    setLoading(true);
    setError(null);

    try {
      if (query) {
        const { data } = await search(query, typeParam, 1);
        setResults(data.results);
        setTotalPages(data.totalPages);
      } else {
        const { data } = await discover(typeParam, genresString, 1);
        setResults(data.results);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.log("Search error:", e);
      setError("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      if (query) {
        const { data } = await search(query, typeParam, nextPage);
        setResults((prev) => [...prev, ...data.results]);
      } else {
        const { data } = await discover(typeParam, genresString, nextPage);
        setResults((prev) => [...prev, ...data.results]);
      }
      setPage(nextPage);
    } catch (e) {
      console.log("Load more error:", e);
    } finally {
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

  // re-search when filter changes immediately
  useEffect(() => {
    handleSearch();
  }, [filter, selectedGenres]);

  // debounce only for query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
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
          onChangeText={setQuery}
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

      {/* Genre chips */}
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
              selectedGenres.includes(genre.id) && searchStyles.genreChipActive,
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
          data={results}
          keyExtractor={(item) => `${item.mediaType}-${item.tmdbId}`}
          renderItem={({ item }) => <SearchMediaCard item={item} />}
          numColumns={3}
          contentContainerStyle={searchStyles.gridContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
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
