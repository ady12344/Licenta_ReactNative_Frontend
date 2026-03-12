import { View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { skeletonStyles } from "../styles/homeStyles";
export default function SkeletonRow() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={skeletonStyles.container}>
      <Animated.View style={[skeletonStyles.labelSkeleton, { opacity }]} />
      <View style={skeletonStyles.row}>
        {[1, 2, 3, 4].map((i) => (
          <Animated.View key={i} style={[skeletonStyles.card, { opacity }]} />
        ))}
      </View>
    </View>
  );
}
