import { View, Text, FlatList, TouchableOpacity } from "react-native";
import MediaCard from "./MediaCard";
import { rowStyles } from "../styles/homeStyles";

export default function MediaRow({ label, data, onSeeMore }) {
  if (!data || data.length === 0) return null;

  return (
    <View style={rowStyles.container}>
      <View style={rowStyles.header}>
        <Text style={rowStyles.label}>{label}</Text>
        {onSeeMore && (
          <TouchableOpacity onPress={onSeeMore}>
            <Text style={rowStyles.seeMore}>See More</Text>
          </TouchableOpacity>
        )}
      </View>
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
