import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView,
    ScrollView, Platform, Animated, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import styles from '../../src/styles/authStyles';

export default function RegisterScreen() {
    const { register } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [errors, setErrors]     = useState({});
    const [modal, setModal]       = useState({ visible: false, title: '', message: '', onOk: null });

    const emailRef    = useRef(null);
    const passwordRef = useRef(null);
    const fadeAnim    = useRef(new Animated.Value(0)).current;
    const slideAnim   = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);

    const showModal = (title, message, onOk) => {
        setModal({ visible: true, title, message, onOk });
    };

    const hideModal = () => {
        const cb = modal.onOk;
        setModal({ visible: false, title: '', message: '', onOk: null });
        if (cb) cb();
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validate = () => {
        const newErrors = {};
        if (!username)
            newErrors.username = 'Username is required';
        if (!email)
            newErrors.email = 'Email is required';
        else if (!validateEmail(email))
            newErrors.email = 'Enter a valid email address';
        if (!password)
            newErrors.password = 'Password is required';
        else if (password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await register(username, email, password);
            showModal(
                'Account created!',
                'Your account has been created successfully. Please sign in.',
                () => router.replace('/(auth)/login')
            );
        } catch (e) {
            const serverMessage = e.response?.data;
            if (serverMessage?.includes('Username')) {
                setErrors({ username: serverMessage });
            } else if (serverMessage?.includes('Email')) {
                setErrors({ email: serverMessage });
            } else {
                showModal('Something went wrong', serverMessage || 'Registration failed. Please try again.', null);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#0f0f0f', '#1a1a2e', '#16213e']} style={styles.container}>

            {/* Themed Modal */}
            <Modal transparent animationType="fade" visible={modal.visible} onRequestClose={hideModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{modal.title}</Text>
                        <Text style={styles.modalMessage}>{modal.message}</Text>
                        <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
                            <LinearGradient
                                colors={['#E50914', '#b20710']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.modalButtonGradient}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        <Text style={styles.title}>Create account</Text>
                        <Text style={styles.subtitle}>Join and start exploring</Text>

                        {/* Username */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text);
                                    if (errors.username) setErrors(prev => ({ ...prev, username: null }));
                                }}
                                placeholder="Choose a username"
                                placeholderTextColor="#555"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onSubmitEditing={() => emailRef.current?.focus()}
                                onFocus={() => setFocusedInput('username')}
                                onBlur={() => setFocusedInput(null)}
                                style={[
                                    styles.input,
                                    focusedInput === 'username' && styles.inputFocused,
                                    errors.username && styles.inputError,
                                ]}
                            />
                            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                ref={emailRef}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                                }}
                                placeholder="Enter your email"
                                placeholderTextColor="#555"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() => passwordRef.current?.focus()}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput(null)}
                                style={[
                                    styles.input,
                                    focusedInput === 'email' && styles.inputFocused,
                                    errors.email && styles.inputError,
                                ]}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                ref={passwordRef}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                                }}
                                placeholder="Choose a password"
                                placeholderTextColor="#555"
                                secureTextEntry
                                returnKeyType="done"
                                onSubmitEditing={handleRegister}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                style={[
                                    styles.input,
                                    focusedInput === 'password' && styles.inputFocused,
                                    errors.password && styles.inputError,
                                ]}
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Button */}
                        <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.buttonWrapper}>
                            <LinearGradient
                                colors={['#E50914', '#b20710']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                {loading
                                    ? <ActivityIndicator color="white" />
                                    : <Text style={styles.buttonText}>Create Account</Text>
                                }
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Link href="/(auth)/login">
                                <Text style={styles.link}>Sign In</Text>
                            </Link>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}