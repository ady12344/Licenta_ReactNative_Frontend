import {
  View, Text, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  getPopularMovies, getNowPlayingMovies, getUpcomingMovies,
  getOnTheAirTv, getPopularTv, getTopRatedTv, getRecommendations
} from '../../src/api/api';
import { homeStyles } from '../../src/styles/homeStyles';
import MediaRow from '../../src/components/MediaRow';
import SkeletonRow from '../../src/components/SkeletonRow';

export default function Home() {
  const router = useRouter();
  const hasFetched = useRef(false);

  const [refreshing, setRefreshing]   = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingTv, setLoadingTv]     = useState(true);
  const [error, setErrors]            = useState(null);

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
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchMovies();
    fetchTv();
    fetchRecommendations();
  }, []);

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
      setErrors(null);
    } catch (e) {
      console.log('Error fetching movies:', e);
      setErrors('Failed to load content. Pull down to refresh.');
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
      setErrors(null);
    } catch (e) {
      console.log('Error fetching tv shows:', e);
      setErrors('Failed to load content. Pull down to refresh.');
    } finally {
      setLoadingTv(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data } = await getRecommendations(1);
      setRecommendations(data.results);
    } catch (e) {
      console.log('Recommendations error:', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setErrors(null);
    setLoadingMovies(true);
    setLoadingTv(true);
    await Promise.all([fetchMovies(), fetchTv(), fetchRecommendations()]);
    setRefreshing(false);
  };

  return (
      <SafeAreaView style={homeStyles.safeArea}>
        <ScrollView
            style={homeStyles.container}
            contentContainerStyle={homeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#E50914"
                  colors={['#E50914']}
              />
            }
        >
          {/* Error message */}
          {error && (
              <View style={homeStyles.errorContainer}>
                <Text style={homeStyles.errorText}>{error}</Text>
              </View>
          )}
          {/* Home title */}
          <Text style={homeStyles.pageTitle}>Home</Text>
          {/* Recommended For You */}
          {recommendations.length > 0 && (
              <>
                <View style={homeStyles.categoryContainer}>
                  <Text style={homeStyles.categoryTitle}>For You</Text>
                  <View style={homeStyles.categoryDivider} />
                </View>
                <MediaRow
                    label="Recommended For You"
                    data={recommendations.slice(0, 10)}
                />
              </>
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
                    onSeeMore={() => router.push('/category/movie-popular')}
                />
                <MediaRow
                    label="Now Playing"
                    data={movies.nowPlaying}
                    onSeeMore={() => router.push('/category/movie-now-playing')}
                />
                <MediaRow
                    label="Upcoming"
                    data={movies.upcoming}
                    onSeeMore={() => router.push('/category/movie-upcoming')}
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
                    onSeeMore={() => router.push('/category/tv-popular')}
                />
                <MediaRow
                    label="Top Rated"
                    data={tv.topRatedTv}
                    onSeeMore={() => router.push('/category/tv-top-rated')}
                />
                <MediaRow
                    label="On The Air"
                    data={tv.onTheAirTv}
                    onSeeMore={() => router.push('/category/tv-on-the-air')}
                />
              </>
          )}
        </ScrollView>
      </SafeAreaView>
  );
}