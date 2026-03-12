import { StyleSheet } from "react-native";

export const CARD_WIDTH = 110;
export const CARD_HEIGHT = 165;

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchText: {
    color: "#555",
    fontSize: 15,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 8,
  },
  categoryTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  categoryDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginTop: 10,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,68,68,0.3)",
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    textAlign: "center",
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 10,
  },
  poster: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    backgroundColor: "#1a1a2e",
  },
  title: {
    color: "#ccc",
    fontSize: 11,
    marginTop: 6,
  },
});

export const rowStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  list: {
    paddingHorizontal: 16,
  },
});

export const skeletonStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  labelSkeleton: {
    width: 100,
    height: 12,
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    backgroundColor: "#1a1a2e",
  },
});

export const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },

  // Search bar
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchBarFocused: {
    borderColor: "#E50914",
    backgroundColor: "rgba(229,9,20,0.07)",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 15,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    color: "#555",
    fontSize: 18,
  },

  // Filter tabs
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  filterButtonActive: {
    backgroundColor: "#E50914",
    borderColor: "#E50914",
  },
  filterText: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "white",
  },

  // Genre chips
  genreContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    height: 44, // fixed height prevents the flash
    alignItems: "center", // center chips vertically
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginRight: 8,
  },
  genreChipActive: {
    backgroundColor: "rgba(229,9,20,0.2)",
    borderColor: "#E50914",
  },
  genreText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  genreTextActive: {
    color: "#E50914",
    fontWeight: "600",
  },

  // Results grid
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    maxWidth: "33.33%",
  },

  // States
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  emptySubtext: {
    color: "#333",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,68,68,0.3)",
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
