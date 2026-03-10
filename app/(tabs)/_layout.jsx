import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#0f0f0f', borderTopColor: '#222' },
                tabBarActiveTintColor: '#E50914',
                tabBarInactiveTintColor: '#555',
            }}
            sceneContainerStyle={{ backgroundColor: '#0f0f0f' }}
        >
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
        </Tabs>
    );
}