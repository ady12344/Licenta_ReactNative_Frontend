import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 60,
    },
    title: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 16,
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#9ca3af',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        color: 'white',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        fontSize: 15,
    },
    inputFocused: {
        borderColor: '#E50914',
        backgroundColor: 'rgba(229,9,20,0.07)',
    },
    inputError: {
        borderColor: '#ff4444',
        backgroundColor: 'rgba(255,68,68,0.07)',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
    },
    buttonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 24,
    },
    button: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#9ca3af',
    },
    link: {
        color: '#E50914',
        fontWeight: '600',
    },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
},
modalBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
},
modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},
modalMessage: {
    color: '#9ca3af',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
},
modalButton: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
},
modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
},
modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
},
});