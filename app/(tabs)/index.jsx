import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getOnTheAirTv,
  getPopularTv,
  getTopRatedTv,
} from "../../src/api/api";
import { homeStyles } from "../../src/styles/homeStyles";
import MediaRow from "../../src/components/MediaRow";
import SkeletonRow from "../../src/components/SkeletonRow";

export default function Home() {
  const { logout } = useAuth();
  const router = useRouter();
  const hasFetched = useRef(false);
  const [movies, setMovies] = useState({
    popular: [],
    nowPlaying: [],
    upcoming: [],
  });
  const [tv, setTv] = useState({
    popularTv: [],
    onTheAirTv: [],
    topRatedTv: [],
  });

  const [loadingMovies, setLoadingMovies] = useState(true); // true because we load on mount
  const [loadingTv, setLoadingTv] = useState(true); // true because we load on mount
  const [error, setErrors] = useState(null);
  const fetchMovies = async () => {
    try {
      const [popular, nowPlaying, upcoming] = await Promise.all([
        getPopularMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
      ]);
      setMovies({
        popular: popular.data.results, // .content to get the array
        nowPlaying: nowPlaying.data.results,
        upcoming: upcoming.data.results,
      });
    } catch (e) {
      console.log("Error fetching movies:", e);
      setErrors("Failed to load content. Pull down to refresh.");
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchTv = async () => {
    try {
      const [popularShows, onTheAir, topRated] = await Promise.all([
        getPopularTv(),
        getOnTheAirTv(),
        getTopRatedTv(),
      ]);
      setTv({
        popularTv: popularShows.data.results,
        onTheAirTv: onTheAir.data.results,
        topRatedTv: topRated.data.results,
      });
    } catch (e) {
      console.log("Error fetching tv shows:", e);
      setErrors("Failed to load content. Pull down to refresh.");
    } finally {
      setLoadingTv(false);
    }
  };

  // useEffect with [] means "run once when the screen first loads"
  // same as @PostConstruct in Java
  useEffect(() => {
    if (hasFetched.current) return; // skip if already fetched
    hasFetched.current = true;
    fetchMovies();
    fetchTv();
  }, []);

  return (
    <SafeAreaView style={homeStyles.safeArea}>
      <ScrollView
        style={homeStyles.container}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search bar */}
        <TouchableOpacity
          style={homeStyles.searchContainer}
          onPress={() => router.push("/search")}
          activeOpacity={0.7}
        >
          <Text style={homeStyles.searchIcon}>🔍</Text>
          <Text style={homeStyles.searchText}>Search movies & TV shows...</Text>
        </TouchableOpacity>

        {/* Error message */}
        {error && (
          <View style={homeStyles.errorContainer}>
            <Text style={homeStyles.errorText}>{error}</Text>
          </View>
        )}

        {/* Movies section */}
        <View style={homeStyles.categoryContainer}>
          <Text style={homeStyles.categoryTitle}>Movies</Text>
          <View style={homeStyles.categoryDivider} />
        </View>

        {loadingMovies ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            <MediaRow label="Popular" data={movies.popular} />
            <MediaRow label="Now Playing" data={movies.nowPlaying} />
            <MediaRow label="Upcoming" data={movies.upcoming} />
          </>
        )}

        {/* TV Shows section */}
        <View style={homeStyles.categoryContainer}>
          <Text style={homeStyles.categoryTitle}>TV Shows</Text>
          <View style={homeStyles.categoryDivider} />
        </View>

        {loadingTv ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            <MediaRow label="Popular" data={tv.popularTv} />
            <MediaRow label="Top Rated" data={tv.topRatedTv} />
            <MediaRow label="On The Air" data={tv.onTheAirTv} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
