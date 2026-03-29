import { StyleSheet } from 'react-native';

export const seasonStyles = StyleSheet.create({
    seasonCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        marginBottom: 8,
        overflow: 'hidden',
    },
    seasonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
    },
    seasonInfo: {
        flex: 1,
    },
    seasonName: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    episodeCount: {
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 2,
    },
    episodesList: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    episodeCard: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
        gap: 12,
    },
    stillImage: {
        width: 100,
        height: 65,
        borderRadius: 6,
        backgroundColor: '#1a1a2e',
    },
    stillPlaceholder: {
        width: 100,
        height: 65,
        borderRadius: 6,
        backgroundColor: '#1a1a2e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    episodeInfo: {
        flex: 1,
    },
    episodeNumber: {
        color: '#E50914',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    episodeName: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    episodeMeta: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#555',
        fontSize: 11,
    },
    episodeOverview: {
        color: '#9ca3af',
        fontSize: 11,
        lineHeight: 16,
    },
    readMore: {
        color: '#E50914',
        fontSize: 11,
        marginTop: 4,
        fontWeight: '600',
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 6,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    showMoreText: {
        color: '#E50914',
        fontSize: 13,
        fontWeight: '600',
    },
});