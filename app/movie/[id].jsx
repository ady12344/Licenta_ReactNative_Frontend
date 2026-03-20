import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef, memo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getMovieDetails,
  getReviews,
  getReviewSummary,
  getUserReview,
  addReview,
  editReview,
  deleteReview,
  addToLibrary,
  removeFromLibrary,
  checkLibrary,
} from "../../src/api/api";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MediaCard from "../../src/components/MediaCard";
import { movieStyles as styles } from "../../src/styles/movieStyles";
import { useAuth } from "../../src/context/AuthContext";

const SENTIMENT_CONFIG = {
  OVERWHELMINGLY_NEGATIVE: {
    icon: "thumbs-down",
    color: "#ef4444",
    label: "Overwhelmingly Negative",
  },
  MOSTLY_NEGATIVE: {
    icon: "thumbs-down-outline",
    color: "#f97316",
    label: "Mostly Negative",
  },
  MIXED: { icon: "remove-circle-outline", color: "#fbbf24", label: "Mixed" },
  MOSTLY_POSITIVE: {
    icon: "thumbs-up-outline",
    color: "#84cc16",
    label: "Mostly Positive",
  },
  POSITIVE: { icon: "thumbs-up", color: "#22c55e", label: "Positive" },
  OVERWHELMINGLY_POSITIVE: {
    icon: "thumbs-up",
    color: "#10b981",
    label: "Overwhelmingly Positive",
  },
};

// ── Static content ─────────────────────────────────────────────────────────────
const MovieStaticContent = memo(
  ({ movie, summary, inLibrary, onToggleLibrary }) => (
    <View>
      <View style={styles.backdropContainer}>
        {movie.backdropPath ? (
          <Image
            source={{ uri: movie.backdropPath }}
            style={styles.backdrop}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={styles.backdropPlaceholder}>
            <Ionicons name="film-outline" size={48} color="#333" />
          </View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(15,15,15,0.8)", "#0f0f0f"]}
          style={styles.backdropGradient}
        />
      </View>

      <View style={styles.infoRow}>
        {movie.posterPath ? (
          <Image
            source={{ uri: movie.posterPath }}
            style={styles.poster}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Ionicons name="film-outline" size={36} color="#333" />
          </View>
        )}
        <View style={styles.infoText}>
          {/* Title + bookmark */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text style={[styles.title, { flex: 1 }]}>{movie.title}</Text>
            <TouchableOpacity onPress={onToggleLibrary} style={{ padding: 4 }}>
              <Ionicons
                name={inLibrary ? "bookmark" : "bookmark-outline"}
                size={24}
                color={inLibrary ? "#E50914" : "#9ca3af"}
              />
            </TouchableOpacity>
          </View>

          {movie.releaseDate && (
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={13} color="#9ca3af" />
              <Text style={styles.meta}>
                {" "}
                {movie.releaseDate.substring(0, 4)}
              </Text>
            </View>
          )}
          {movie.tmdbRating && (
            <View style={styles.metaRow}>
              <Ionicons name="star" size={13} color="#fbbf24" />
              <Text style={styles.rating}> {movie.tmdbRating.toFixed(1)}</Text>
            </View>
          )}
          {summary ? (
            summary.sentiment ? (
              <View style={styles.metaRow}>
                <Ionicons
                  name={SENTIMENT_CONFIG[summary.sentiment].icon}
                  size={13}
                  color={SENTIMENT_CONFIG[summary.sentiment].color}
                />
                <Text
                  style={[
                    styles.meta,
                    { color: SENTIMENT_CONFIG[summary.sentiment].color },
                  ]}
                >
                  {" "}
                  {SENTIMENT_CONFIG[summary.sentiment].label}
                </Text>
              </View>
            ) : (
              <View style={styles.metaRow}>
                <Ionicons name="chatbubble-outline" size={13} color="#555" />
                <Text style={[styles.meta, { color: "#555" }]}>
                  {" "}
                  No reviews yet
                </Text>
              </View>
            )
          ) : null}
          {movie.status && (
            <View style={styles.metaRow}>
              <Ionicons
                name="information-circle-outline"
                size={13}
                color="#9ca3af"
              />
              <Text style={styles.status}> {movie.status}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genreRow}>
            {movie.genres.map((genre, index) => (
              <View key={index} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}
        {movie.overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        )}
        {movie.directorName && movie.directorName !== "Unknown Director" && (
          <View style={styles.section}>
            <View style={styles.directorRow}>
              <Ionicons name="videocam-outline" size={16} color="#9ca3af" />
              <Text style={[styles.sectionTitle, { lineHeight: 16 }]}>
                Director
              </Text>
            </View>
            <Text style={styles.directorName}>{movie.directorName}</Text>
          </View>
        )}
        {movie.topCast && movie.topCast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              data={movie.topCast}
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
                      <Ionicons name="person-outline" size={28} color="#333" />
                    </View>
                  )}
                  <Text style={styles.castName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  {item.character && (
                    <Text style={styles.castCharacter} numberOfLines={2}>
                      {item.character}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        )}
        {movie.similarMovies && movie.similarMovies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Movies</Text>
            <FlatList
              data={movie.similarMovies}
              keyExtractor={(item) => `similar-${item.tmdbId}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <MediaCard item={item} />}
            />
          </View>
        )}
        {movie.recommendedMovies && movie.recommendedMovies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <FlatList
              data={movie.recommendedMovies}
              keyExtractor={(item) => `rec-${item.tmdbId}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <MediaCard item={item} />}
            />
          </View>
        )}
      </View>
    </View>
  ),
);

// ── Review section ─────────────────────────────────────────────────────────────
const ReviewSection = memo(
  ({
    summary,
    userReview,
    submitting,
    reviews,
    onSubmit,
    onDelete,
    loadingMore,
    initialText,
    initialLiked,
  }) => {
    const [text, setText] = useState(initialText || "");
    const [liked, setLiked] = useState(initialLiked ?? null);

    useEffect(() => {
      setText(initialText || "");
    }, [initialText]);

    useEffect(() => {
      setLiked(initialLiked ?? null);
    }, [initialLiked]);

    return (
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {summary && (
          <Text style={[styles.meta, { marginBottom: 16 }]}>
            {summary.totalReviews} reviews ·{" "}
            {Math.round(summary.positivePercentage)}% positive
          </Text>
        )}

        {userReview && (
          <View style={styles.userReviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.metaRow}>
                <Text style={styles.reviewUsername}>{userReview.username}</Text>
                <Ionicons
                  name={userReview.liked ? "thumbs-up" : "thumbs-down"}
                  size={16}
                  color={userReview.liked ? "#22c55e" : "#E50914"}
                  style={{ marginLeft: 6 }}
                />
              </View>
              <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash-outline" size={18} color="#E50914" />
              </TouchableOpacity>
            </View>
            <Text style={styles.overview}>{userReview.content}</Text>
            <Text style={[styles.meta, { marginTop: 4 }]}>
              {new Date(userReview.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.reviewForm}>
          <Text style={styles.sectionTitle}>
            {userReview ? "Edit Your Review" : "Write a Review"}
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginVertical: 12 }}>
            <TouchableOpacity onPress={() => setLiked(true)}>
              <Ionicons
                name="thumbs-up"
                size={28}
                color={liked === true ? "#22c55e" : "#555"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLiked(false)}>
              <Ionicons
                name="thumbs-down"
                size={28}
                color={liked === false ? "#E50914" : "#555"}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write your review..."
            placeholderTextColor="#555"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.reviewInput}
          />
          <View style={{ alignItems: "flex-end", marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => onSubmit(text, liked)}
              disabled={submitting}
              style={[
                styles.submitButton,
                submitting && { backgroundColor: "#333" },
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {userReview ? "Update" : "Submit"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {reviews.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
              All Reviews
            </Text>
            {reviews.map((item, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUsername}>{item.username}</Text>
                  <Ionicons
                    name={item.liked ? "thumbs-up" : "thumbs-down"}
                    size={16}
                    color={item.liked ? "#22c55e" : "#E50914"}
                  />
                </View>
                <Text style={styles.overview}>{item.content}</Text>
                <Text style={[styles.meta, { marginTop: 4 }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
            {loadingMore && (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator color="#E50914" />
              </View>
            )}
          </View>
        )}
      </View>
    );
  },
);

// ── Main component ─────────────────────────────────────────────────────────────
export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);

  const backButtonOpacity = useRef(new Animated.Value(0)).current;
  const isLoadingMoreReviews = useRef(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadMovie();
    Animated.timing(backButtonOpacity, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (movie) loadReviews();
  }, [movie]);

  const loadMovie = async () => {
    try {
      const { data } = await getMovieDetails(id);
      setMovie(data);
      const { data: libraryStatus } = await checkLibrary(
        data.tmdbId,
        data.mediaType,
      );
      setInLibrary(libraryStatus);
    } catch (e) {
      console.log("Movie detail error:", e);
      setError("Failed to load movie details.");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const [summaryRes, userReviewRes, reviewsRes] = await Promise.all([
        getReviewSummary(movie.tmdbId, movie.mediaType),
        getUserReview(movie.tmdbId, movie.mediaType),
        getReviews(movie.tmdbId, movie.mediaType, 1),
      ]);
      setSummary(summaryRes.data);
      setUserReview(userReviewRes.data);
      setReviews(reviewsRes.data.results);
      setReviewTotalPages(reviewsRes.data.totalPages);
    } catch (e) {
      console.log("Load reviews error:", e);
    }
  };

  const loadMoreReviews = async () => {
    if (isLoadingMoreReviews.current || reviewPage >= reviewTotalPages) return;
    isLoadingMoreReviews.current = true;
    setLoadingMoreReviews(true);
    try {
      const nextPage = reviewPage + 1;
      const { data } = await getReviews(
        movie.tmdbId,
        movie.mediaType,
        nextPage,
      );
      setReviews((prev) => [...prev, ...data.results]);
      setReviewPage(nextPage);
    } catch (e) {
      console.log("Load more reviews error:", e);
    } finally {
      isLoadingMoreReviews.current = false;
      setLoadingMoreReviews(false);
    }
  };

  const submitReview = async (reviewText, liked) => {
    if (liked === null || reviewText.trim() === "") return;
    setSubmitting(true);
    try {
      if (userReview) {
        await editReview(movie.tmdbId, movie.mediaType, liked, reviewText);
        setUserReview({ ...userReview, liked, content: reviewText });
        setReviews((prev) =>
          prev.map((r) =>
            r.username === user ? { ...r, liked, content: reviewText } : r,
          ),
        );
      } else {
        await addReview(movie.tmdbId, movie.mediaType, liked, reviewText);
        const newReview = {
          username: user,
          liked,
          content: reviewText,
          createdAt: new Date().toISOString(),
        };
        setUserReview(newReview);
        setReviews((prev) => [newReview, ...prev]);
      }
      const { data } = await getReviewSummary(movie.tmdbId, movie.mediaType);
      setSummary(data);
    } catch (e) {
      console.log("Submit review error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(movie.tmdbId, movie.mediaType);
      setUserReview(null);
      setReviews((prev) => prev.filter((r) => r.username !== user));
      const { data } = await getReviewSummary(movie.tmdbId, movie.mediaType);
      setSummary(data);
    } catch (e) {
      console.log("Delete review error:", e);
    }
  };

  const toggleLibrary = async () => {
    try {
      if (inLibrary) {
        await removeFromLibrary(movie.tmdbId, movie.mediaType);
        setInLibrary(false);
      } else {
        await addToLibrary(
          movie.tmdbId,
          movie.mediaType,
          movie.title,
          movie.posterPath,
        );
        setInLibrary(true);
      }
    } catch (e) {
      console.log("Library error:", e);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E50914" size="large" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || "Movie not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            const isCloseToBottom =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 200;
            if (isCloseToBottom) loadMoreReviews();
          }}
          scrollEventThrottle={400}
        >
          <MovieStaticContent
            movie={movie}
            summary={summary}
            inLibrary={inLibrary}
            onToggleLibrary={toggleLibrary}
          />
          <ReviewSection
            summary={summary}
            userReview={userReview}
            submitting={submitting}
            reviews={reviews}
            loadingMore={loadingMoreReviews}
            initialText={userReview?.content || ""}
            initialLiked={userReview?.liked ?? null}
            onSubmit={submitReview}
            onDelete={handleDeleteReview}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
