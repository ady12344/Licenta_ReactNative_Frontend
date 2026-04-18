import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView,
    ScrollView, Platform, Animated, StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword, resetPassword } from '../../src/api/api';
import styles from '../../src/styles/authStyles';

export default function ForgotPassword() {
    const router = useRouter();

    const [step, setStep]               = useState(1);
    const [email, setEmail]             = useState('');
    const [code, setCode]               = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading]         = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [error, setError]             = useState(null);
    const [success, setSuccess]         = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const fadeAnim  = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1, duration: 600, useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0, tension: 60, friction: 10, useNativeDriver: true,
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

    const handleSendCode = async () => {
        if (!email.trim()) {
            setError('Email is required.');
            shakeInputs();
            return;
        }
        setError(null);
        // switch to step 2 immediately
        setStep(2);
        setSendingCode(true);
        try {
            await forgotPassword(email.trim());
        } catch (e) {
            setError(e.response?.data || 'Failed to send code. Check your email.');
            setStep(1);
        } finally {
            setSendingCode(false);
        }
    };

    const handleResetPassword = async () => {
        if (!code.trim()) {
            setError('Code is required.');
            shakeInputs();
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            shakeInputs();
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            shakeInputs();
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await resetPassword(email.trim(), code.trim(), newPassword);
            setSuccess(true);
            setTimeout(() => {
                router.replace('/(auth)/login');
            }, 2000);
        } catch (e) {
            setError(e.response?.data || 'Invalid or expired code.');
            shakeInputs();
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
                        {/* Back button */}
                        <TouchableOpacity
                            onPress={() => step === 2 ? setStep(1) : router.back()}
                            style={{ marginBottom: 24 }}
                        >
                            <Ionicons name="chevron-back" size={28} color="#E50914" />
                        </TouchableOpacity>

                        <Text style={styles.title}>
                            {step === 1 ? 'Forgot Password' : 'Reset Password'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {step === 1
                                ? 'Enter your email to receive a reset code'
                                : 'Enter the code sent to your email'}
                        </Text>

                        {/* Success */}
                        {success ? (
                            <View style={forgotStyles.successBox}>
                                <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
                                <Text style={forgotStyles.successText}>Password reset!</Text>
                                <Text style={forgotStyles.successSubtext}>Redirecting to login...</Text>
                            </View>
                        ) : (
                            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>

                                {/* Error */}
                                {error && (
                                    <View style={forgotStyles.errorBox}>
                                        <Text style={forgotStyles.errorText}>{error}</Text>
                                    </View>
                                )}

                                {step === 1 ? (
                                    <View>
                                        {/* Email */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Email</Text>
                                            <TextInput
                                                value={email}
                                                onChangeText={(t) => { setEmail(t); setError(null); }}
                                                placeholder="Enter your email"
                                                placeholderTextColor="#555"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                onFocus={() => setFocusedInput('email')}
                                                onBlur={() => setFocusedInput(null)}
                                                style={[
                                                    styles.input,
                                                    focusedInput === 'email' && styles.inputFocused,
                                                    error && styles.inputError,
                                                ]}
                                            />
                                        </View>

                                        {/* Send code button */}
                                        <TouchableOpacity onPress={handleSendCode} disabled={loading} style={styles.buttonWrapper}>
                                            <LinearGradient
                                                colors={['#E50914', '#b20710']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={styles.button}
                                            >
                                                {loading
                                                    ? <ActivityIndicator color="white" />
                                                    : <Text style={styles.buttonText}>Send Reset Code</Text>
                                                }
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View>
                                        {/* Sending code indicator */}
                                        {sendingCode && (
                                            <View style={forgotStyles.sendingBox}>
                                                <ActivityIndicator color="#E50914" size="small" />
                                                <Text style={forgotStyles.sendingText}>Sending code to your email...</Text>
                                            </View>
                                        )}

                                        {/* Code */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Reset Code</Text>
                                            <TextInput
                                                value={code}
                                                onChangeText={(t) => { setCode(t); setError(null); }}
                                                placeholder="000000"
                                                placeholderTextColor="#333"
                                                keyboardType="number-pad"
                                                maxLength={6}
                                                onFocus={() => setFocusedInput('code')}
                                                onBlur={() => setFocusedInput(null)}
                                                style={[
                                                    styles.input,
                                                    focusedInput === 'code' && styles.inputFocused,
                                                    { textAlign: 'center', fontSize: 18, letterSpacing: 6 },
                                                ]}
                                            />
                                        </View>

                                        {/* New password */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>New Password</Text>
                                            <TextInput
                                                value={newPassword}
                                                onChangeText={(t) => { setNewPassword(t); setError(null); }}
                                                placeholder="Enter new password"
                                                placeholderTextColor="#555"
                                                secureTextEntry
                                                onFocus={() => setFocusedInput('newPassword')}
                                                onBlur={() => setFocusedInput(null)}
                                                style={[
                                                    styles.input,
                                                    focusedInput === 'newPassword' && styles.inputFocused,
                                                ]}
                                            />
                                        </View>

                                        {/* Confirm password */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Confirm Password</Text>
                                            <TextInput
                                                value={confirmPassword}
                                                onChangeText={(t) => { setConfirmPassword(t); setError(null); }}
                                                placeholder="Confirm new password"
                                                placeholderTextColor="#555"
                                                secureTextEntry
                                                onFocus={() => setFocusedInput('confirmPassword')}
                                                onBlur={() => setFocusedInput(null)}
                                                style={[
                                                    styles.input,
                                                    focusedInput === 'confirmPassword' && styles.inputFocused,
                                                ]}
                                            />
                                        </View>

                                        {/* Reset button */}
                                        <TouchableOpacity onPress={handleResetPassword} disabled={loading || sendingCode} style={styles.buttonWrapper}>
                                            <LinearGradient
                                                colors={['#E50914', '#b20710']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={styles.button}
                                            >
                                                {loading
                                                    ? <ActivityIndicator color="white" />
                                                    : <Text style={styles.buttonText}>Reset Password</Text>
                                                }
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        {/* Resend code */}
                                        <TouchableOpacity
                                            onPress={() => { setStep(1); setError(null); setCode(''); }}
                                            style={{ marginTop: 16, alignItems: 'center' }}
                                        >
                                            <Text style={forgotStyles.resendText}>Didn't receive code? Go back</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Animated.View>
                        )}

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const forgotStyles = StyleSheet.create({
    errorBox: {
        backgroundColor: 'rgba(255,68,68,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,68,68,0.3)',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        textAlign: 'center',
    },
    successBox: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 12,
    },
    successText: {
        color: '#22c55e',
        fontSize: 20,
        fontWeight: 'bold',
    },
    successSubtext: {
        color: '#9ca3af',
        fontSize: 14,
    },
    sendingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: 'rgba(229,9,20,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(229,9,20,0.2)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    sendingText: {
        color: '#E50914',
        fontSize: 13,
    },
    resendText: {
        color: '#E50914',
        fontSize: 14,
    },
});