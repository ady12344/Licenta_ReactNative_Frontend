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

export const getMovieDetails = async (id) => apiClient.get(`api/movie/${id}`);
export const getTvDetails = async (id) => apiClient.get(`/api/tv/${id}`);
