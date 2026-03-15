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
  getTvDetails,
  getReviews,
  getReviewSummary,
  getUserReview,
  addReview,
  editReview,
  deleteReview,
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
const TvStaticContent = memo(({ show, summary }) => (
  <View>
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
      {show.genres && show.genres.length > 0 && (
        <View style={styles.genreRow}>
          {show.genres.map((genre, index) => (
            <View key={index} style={styles.genreChip}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      )}
      {show.overview && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{show.overview}</Text>
        </View>
      )}
      {show.directorName && show.directorName !== "Unknown Director" && (
        <View style={styles.section}>
          <View style={styles.directorRow}>
            <Ionicons name="videocam-outline" size={16} color="#9ca3af" />
            <Text style={[styles.sectionTitle, { lineHeight: 16 }]}>
              Director
            </Text>
          </View>
          <Text style={styles.directorName}>{show.directorName}</Text>
        </View>
      )}
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
                    <Ionicons name="person-outline" size={28} color="#333" />
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
  </View>
));

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
export default function TvDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);

  const backButtonOpacity = useRef(new Animated.Value(0)).current;
  const isLoadingMoreReviews = useRef(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadShow();
    Animated.timing(backButtonOpacity, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (show) loadReviews();
  }, [show]);

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

  const loadReviews = async () => {
    try {
      const [summaryRes, userReviewRes, reviewsRes] = await Promise.all([
        getReviewSummary(show.tmdbId, show.mediaType),
        getUserReview(show.tmdbId, show.mediaType),
        getReviews(show.tmdbId, show.mediaType, 1),
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
      const { data } = await getReviews(show.tmdbId, show.mediaType, nextPage);
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
        await editReview(show.tmdbId, show.mediaType, liked, reviewText);
        setUserReview({ ...userReview, liked, content: reviewText });
        setReviews((prev) =>
          prev.map((r) =>
            r.username === user ? { ...r, liked, content: reviewText } : r,
          ),
        );
      } else {
        await addReview(show.tmdbId, show.mediaType, liked, reviewText);
        const newReview = {
          username: user,
          liked,
          content: reviewText,
          createdAt: new Date().toISOString(),
        };
        setUserReview(newReview);
        setReviews((prev) => [newReview, ...prev]);
      }
      const { data } = await getReviewSummary(show.tmdbId, show.mediaType);
      setSummary(data);
    } catch (e) {
      console.log("Submit review error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(show.tmdbId, show.mediaType);
      setUserReview(null);
      setReviews((prev) => prev.filter((r) => r.username !== user));
      const { data } = await getReviewSummary(show.tmdbId, show.mediaType);
      setSummary(data);
    } catch (e) {
      console.log("Delete review error:", e);
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
          <TvStaticContent show={show} summary={summary} />
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
