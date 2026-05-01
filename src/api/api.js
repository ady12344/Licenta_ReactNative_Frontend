import apiClient from "./apiClient";

// ===== MOVIES =====
// GET /api/movie/popular?page=1
export const getPopularMovies = async (page = 1) =>
  apiClient.get(`/api/movie/popular?page=${page}`);

// GET /api/movie/now-playing?page=1
export const getNowPlayingMovies = async (page = 1) =>
  apiClient.get(`/api/movie/now-playing?page=${page}`);

// GET /api/movie/upcoming?page=1
export const getUpcomingMovies = async (page = 1) =>
  apiClient.get(`/api/movie/upcoming?page=${page}`);

// ===== TV =====
// GET /api/tv/popular?page=1
export const getPopularTv = async (page = 1) =>
  apiClient.get(`/api/tv/popular?page=${page}`);

// GET /api/tv/top-rated?page=1
export const getTopRatedTv = async (page = 1) =>
  apiClient.get(`/api/tv/top-rated?page=${page}`);

// GET /api/tv/on-the-air?page=1
export const getOnTheAirTv = async (page = 1) =>
  apiClient.get(`/api/tv/on-the-air?page=${page}`);

// replace the old search/discover calls with these two:
export const search = async (query, type = null, page = 1) =>
  apiClient.get(
    `/api/search?query=${query}&page=${page}${type ? `&type=${type}` : ""}`,
  );

export const discover = async (type = null, genres = null, page = 1) =>
  apiClient.get(
    `/api/search/discover?page=${page}${type ? `&type=${type}` : ""}${genres ? `&genres=${genres}` : ""}`,
  );

export const getMovieDetails = async (id) => apiClient.get(`/api/movie/${id}`);
export const getTvDetails = async (id) => apiClient.get(`/api/tv/${id}`);

// Reviews
export const getReviews = async (tmdbId, mediaType, page = 1) =>
  apiClient.get(
    `/api/reviews?tmdbId=${tmdbId}&mediaType=${mediaType}&page=${page}`,
  );
export const getReviewSummary = async (tmdbId, mediaType) =>
  apiClient.get(`/api/reviews/summary?tmdbId=${tmdbId}&mediaType=${mediaType}`);
export const getUserReview = async (tmdbId, mediaType) =>
  apiClient.get(`/api/reviews/user?tmdbId=${tmdbId}&mediaType=${mediaType}`);
export const addReview = async (tmdbId, mediaType, liked, content) =>
  apiClient.post("/api/reviews", {
    tmdbId: tmdbId,
    mediaType: mediaType,
    liked: liked,
    content: content,
  });
export const editReview = async (tmdbId, mediaType, liked, content) =>
  apiClient.put(`/api/reviews/edit`, {
    tmdbId: tmdbId,
    mediaType: mediaType,
    liked: liked,
    content: content,
  });
export const deleteReview = async (tmdbId, mediaType) =>
  apiClient.delete(`/api/reviews?tmdbId=${tmdbId}&mediaType=${mediaType}`);

export const getLibrary = async (type = null, page = 1, size = 10) =>
  apiClient.get(
    `/api/library?page=${page}&size=${size}${type ? `&type=${type}` : ""}`,
  );

export const addToLibrary = async (tmdbId, mediaType, title, posterPath, genres) =>
    apiClient.post('/api/library/add', { tmdbId, mediaType, title, posterPath, genres });

export const removeFromLibrary = async (tmdbId, mediaType) =>
  apiClient.delete(
    `/api/library/remove?tmdbId=${tmdbId}&mediaType=${mediaType}`,
  );

export const checkLibrary = async (tmdbId, mediaType) =>
  apiClient.get(`/api/library/check?tmdbId=${tmdbId}&mediaType=${mediaType}`);

export const getUserStats = async () => apiClient.get("/api/users/stats");

export const getMe = async () => apiClient.get("/api/users/me");

export const changePassword = async (currentPassword, newPassword) =>
  apiClient.post("/api/users/change-password", {
    currentPassword,
    newPassword,
  });

export const getMovieWatchProviders = async (tmdbId, country = 'RO') =>
    apiClient.get(`/api/movie/${tmdbId}/watch-providers?country=${country}`);

export const getTvWatchProviders = async (tmdbId, country = 'RO') =>
    apiClient.get(`/api/tv/${tmdbId}/watch-providers?country=${country}`);

export const getTvSeason = async (tvId, seasonNumber) =>
    apiClient.get(`/api/tv/${tvId}/season/${seasonNumber}`);

export const getPersonDetails = async (id) =>
    apiClient.get(`/api/person/${id}`);

export const forgotPassword = async (email) =>
    apiClient.post('/api/users/forgot-password', { email });

export const resetPassword = async (email, code, newPassword) =>
    apiClient.post('/api/users/reset-password', { email, code, newPassword });
export const getAiSummary = async (tmdbId, mediaType) =>
    apiClient.get(`/api/reviews/ai-summary?tmdbId=${tmdbId}&mediaType=${mediaType}`);

export const getRecommendations = async (page = 1) =>
    apiClient.get(`/api/recommendations?page=${page}`);