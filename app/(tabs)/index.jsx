import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
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
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();
  const hasFetched = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
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
        popular: popular.data.results,
        nowPlaying: nowPlaying.data.results,
        upcoming: upcoming.data.results,
      });
      setErrors(null); // clear error on success
    } catch (e) {
      console.log("Error fetching movies:", e);
      setErrors("Failed to load content. Pull down to refresh.");
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchTv = async () => {
    try {
      const [popular, onTheAir, topRated] = await Promise.all([
        getPopularTv(),
        getOnTheAirTv(),
        getTopRatedTv(),
      ]);
      setTv({
        popularTv: popular.data.results,
        onTheAirTv: onTheAir.data.results,
        topRatedTv: topRated.data.results,
      });
      setErrors(null); // clear error on success
    } catch (e) {
      console.log("Error fetching tv shows:", e);
      setErrors("Failed to load content. Pull down to refresh.");
    } finally {
      setLoadingTv(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setErrors(null); // clear error immediately
    setLoadingMovies(true); // show skeletons while refreshing
    setLoadingTv(true);
    await Promise.all([fetchMovies(), fetchTv()]);
    setRefreshing(false);
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
      <TouchableOpacity
        onPress={logout}
        style={{
          padding: 16,
          backgroundColor: "#E50914",
          margin: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
      </TouchableOpacity>

      <ScrollView
        style={homeStyles.container}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E50914"
            colors={["#E50914"]}
          />
        }
      >
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
            <MediaRow
              label="Popular"
              data={movies.popular}
              onSeeMore={() => router.push("/category/movie-popular")}
            />
            <MediaRow
              label="Now Playing"
              data={movies.nowPlaying}
              onSeeMore={() => router.push("/category/movie-now-playing")}
            />
            <MediaRow
              label="Upcoming"
              data={movies.upcoming}
              onSeeMore={() => router.push("/category/movie-upcoming")}
            />
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
            <MediaRow
              label="Popular"
              data={tv.popularTv}
              onSeeMore={() => router.push("/category/tv-popular")}
            />
            <MediaRow
              label="Top Rated"
              data={tv.topRatedTv}
              onSeeMore={() => router.push("/category/tv-top-rated")}
            />
            <MediaRow
              label="On The Air"
              data={tv.onTheAirTv}
              onSeeMore={() => router.push("/category/tv-on-the-air")}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
