import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView,
    ScrollView, Platform, Animated, StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link , useRouter} from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import styles from '../../src/styles/authStyles';
export default function LoginScreen() {
    const { login } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [errors, setErrors]     = useState({});

    const passwordRef = useRef(null);
    const fadeAnim    = useRef(new Animated.Value(0)).current;
    const slideAnim   = useRef(new Animated.Value(40)).current;
    const shakeAnim   = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const shakeInputs = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const validate = () => {
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) {
            shakeInputs();
            return;
        }
        setLoading(true);
        try {
            await login(username, password);
        } catch (e) {
            shakeInputs();
            setErrors({
                credentials: 'Invalid username or password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#0f0f0f', '#1a1a2e', '#16213e']} style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }}>

                        <Text style={styles.title}>Welcome back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>

                        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>

                            {/* Credentials error */}
                            {errors.credentials && (
                                <View style={loginStyles.credentialsError}>
                                    <Text style={loginStyles.credentialsErrorText}>
                                        {errors.credentials}
                                    </Text>
                                </View>
                            )}

                            {/* Username */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput
                                    value={username}
                                    onChangeText={(text) => {
                                        setUsername(text);
                                        if (errors.username || errors.credentials)
                                            setErrors({});
                                    }}
                                    placeholder="Enter your username"
                                    placeholderTextColor="#555"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                    onFocus={() => setFocusedInput('username')}
                                    onBlur={() => setFocusedInput(null)}
                                    style={[
                                        styles.input,
                                        focusedInput === 'username' && styles.inputFocused,
                                        (errors.username || errors.credentials) && styles.inputError,
                                    ]}
                                />
                                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                            </View>

                            {/* Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    ref={passwordRef}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (errors.password || errors.credentials)
                                            setErrors({});
                                    }}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#555"
                                    secureTextEntry
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    style={[
                                        styles.input,
                                        focusedInput === 'password' && styles.inputFocused,
                                        (errors.password || errors.credentials) && styles.inputError,
                                    ]}
                                />
                                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            </View>
                            {/* Add this after the password input group */}
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/forgot-password')}
                                style={{ alignItems: 'flex-end', marginBottom: 8 }}
                            >
                                <Text style={{ color: '#E50914', fontSize: 13 }}>Forgot Password?</Text>
                            </TouchableOpacity>

                        </Animated.View>

                        {/* Button */}
                        <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.buttonWrapper}>
                            <LinearGradient
                                colors={['#E50914', '#b20710']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                {loading
                                    ? <ActivityIndicator color="white" />
                                    : <Text style={styles.buttonText}>Sign In</Text>
                                }
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Link href="/(auth)/register">
                                <Text style={styles.link}>Register</Text>
                            </Link>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const loginStyles = StyleSheet.create({
    credentialsError: {
        backgroundColor: 'rgba(255,68,68,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,68,68,0.3)',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    credentialsErrorText: {
        color: '#ff4444',
        fontSize: 14,
        textAlign: 'center',
    },
});