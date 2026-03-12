import { View, Text, FlatList } from "react-native";
import MediaCard from "./MediaCard";
import { rowStyles } from "../styles/homeStyles";

export default function MediaRow({ label, data }) {
  // 1. If data is empty or null, return null (don't render anything)
  if (!data) return null;

  return (
    <View style={rowStyles.container}>
      <Text style={rowStyles.label}>{label}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.tmdbId.toString()}
        renderItem={({ item }) => <MediaCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={rowStyles.list}
      />
    </View>
  );
}
