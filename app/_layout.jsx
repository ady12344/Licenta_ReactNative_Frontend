import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "(auth)";
    const inTabs = segments[0] === "(tabs)";
    const inCategory = segments[0] === "category";
    const inMovie = segments[0] === "movie";
    const inTv = segments[0] === "tv";

    if (!user && !inAuth) router.replace("/(auth)/login");
    else if (user && !inTabs && !inCategory && !inMovie && !inTv)
      router.replace("/(tabs)");
  }, [user, loading, segments]);

  if (loading) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0f0f0f" },
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      <Stack.Screen name="category/[type]" />
      <Stack.Screen name="library/[type]" />
      <Stack.Screen name="movie/[id]" />
      <Stack.Screen name="tv/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
