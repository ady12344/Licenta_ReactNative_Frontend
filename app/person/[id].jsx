import {
    View, Text, ScrollView, ActivityIndicator,
    TouchableOpacity, FlatList, Animated
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getPersonDetails } from '../../src/api/api';
import MediaCard from '../../src/components/MediaCard';
import {personStyles as styles} from '../../src/styles/personStyles'

export default function PersonDetail() {
    const { id }  = useLocalSearchParams();
    const router  = useRouter();
    const insets  = useSafeAreaInsets();

    const [person, setPerson]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [bioExpanded, setBioExpanded] = useState(false);

    const backButtonOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadPerson();
        Animated.timing(backButtonOpacity, {
            toValue: 1, duration: 400, delay: 100, useNativeDriver: true,
        }).start();
    }, []);

    const loadPerson = async () => {
        try {
            const { data } = await getPersonDetails(id);
            setPerson(data);
        } catch (e) {
            console.log('Person detail error:', e);
            setError('Failed to load person details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#E50914" size="large" />
            </View>
        );
    }

    if (error || !person) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error || 'Person not found'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Back button */}
            <Animated.View style={[styles.backButton, { top: insets.top + 8, opacity: backButtonOpacity }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInner}>
                    <Ionicons name="chevron-back" size={32} color="#E50914" />
                </TouchableOpacity>
            </Animated.View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

                {/* Header */}
                <View style={styles.header}>
                    {person.profilePath ? (
                        <Image
                            source={{ uri: person.profilePath }}
                            style={styles.profileImage}
                            contentFit="cover"
                            transition={300}
                            cachePolicy="memory-disk"
                        />
                    ) : (
                        <View style={styles.profilePlaceholder}>
                            <Ionicons name="person-outline" size={60} color="#333" />
                        </View>
                    )}
                    <LinearGradient
                        colors={['transparent', 'rgba(15,15,15,0.8)', '#0f0f0f']}
                        style={styles.headerGradient}
                    />
                </View>

                <View style={styles.content}>
                    {/* Name + department */}
                    <Text style={styles.name}>{person.name}</Text>
                    {person.knownForDepartment && (
                        <Text style={styles.department}>{person.knownForDepartment}</Text>
                    )}

                    {/* Birthday + place */}
                    <View style={styles.metaContainer}>
                        {person.birthday && (
                            <View style={styles.metaRow}>
                                <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                                <Text style={styles.metaText}> {person.birthday}</Text>
                            </View>
                        )}
                        {person.placeOfBirth && (
                            <View style={styles.metaRow}>
                                <Ionicons name="location-outline" size={14} color="#9ca3af" />
                                <Text style={styles.metaText}> {person.placeOfBirth}</Text>
                            </View>
                        )}
                    </View>

                    {/* Biography */}
                    {person.biography ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Biography</Text>
                            <Text
                                style={styles.biography}
                                numberOfLines={bioExpanded ? undefined : 4}
                            >
                                {person.biography}
                            </Text>
                            {person.biography.length > 200 && (
                                <TouchableOpacity onPress={() => setBioExpanded(prev => !prev)}>
                                    <Text style={styles.readMore}>
                                        {bioExpanded ? 'Show less' : 'Read more'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : null}

                    {/* Movie credits */}
                    {person.movieCredits && person.movieCredits.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Movies</Text>
                            <FlatList
                                data={person.movieCredits}
                                keyExtractor={(item) => `movie-${item.tmdbId}`}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => <MediaCard item={item} />}
                            />
                        </View>
                    )}

                    {/* TV credits */}
                    {person.tvCredits && person.tvCredits.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>TV Shows</Text>
                            <FlatList
                                data={person.tvCredits}
                                keyExtractor={(item) => `tv-${item.tmdbId}`}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => <MediaCard item={item} />}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}