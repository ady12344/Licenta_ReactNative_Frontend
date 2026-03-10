import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function Home() {
    const { logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>
            <TouchableOpacity onPress={logout} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#E50914',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});