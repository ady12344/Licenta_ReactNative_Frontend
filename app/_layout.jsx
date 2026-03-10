import { useEffect } from 'react';
import { useRouter, useSegments, Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;
        const inAuth = segments[0] === '(auth)';
        const inTabs = segments[0] === '(tabs)';
        if (!user && !inAuth) router.replace('/(auth)/login');
        else if (user && !inTabs) router.replace('/(tabs)');
    }, [user, loading, segments]);

    if (loading) return null;

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}