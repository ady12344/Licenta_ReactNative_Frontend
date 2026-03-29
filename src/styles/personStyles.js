import { StyleSheet } from 'react-native';

export const personStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0f0f0f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'white',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
    },
    backButtonInner: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 300,
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profilePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a2e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    name: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    department: {
        color: '#E50914',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    metaContainer: {
        gap: 6,
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#9ca3af',
        fontSize: 13,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    biography: {
        color: '#9ca3af',
        fontSize: 14,
        lineHeight: 22,
    },
    readMore: {
        color: '#E50914',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 6,
    },
});