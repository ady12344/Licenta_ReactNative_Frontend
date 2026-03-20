import { StyleSheet } from "react-native";

export const libraryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  pageTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#E50914",
    fontSize: 13,
    fontWeight: "600",
  },
  horizontalList: {
    paddingHorizontal: 16,
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
  },
  // for library/[type].jsx
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
  },
  backButtonInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
    paddingTop: 12,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
