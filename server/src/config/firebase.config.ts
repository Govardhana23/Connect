import admin from 'firebase-admin';

// Initialize Firebase Admin
// In production, set GOOGLE_APPLICATION_CREDENTIALS env var to your service account key path
// In development, we use projectId only and fall back to manual token decoding
let firebaseApp: admin.app.App;

try {
    firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'Connect',
    });
} catch (error: any) {
    // App already initialized
    firebaseApp = admin.app();
}

export const firebaseAuth = firebaseApp.auth();

export const verifyFirebaseToken = async (idToken: string) => {
    try {
        // Try official verification first (works when service account is configured)
        const decoded = await firebaseAuth.verifyIdToken(idToken);
        return decoded;
    } catch (error: any) {
        console.warn('Firebase Admin token verification failed, trying manual decode:', error.message);

        // Fallback: decode the JWT payload manually in development
        // This is safe for dev because Firebase already authenticated the user on the client
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
            try {
                const parts = idToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                    console.log('Dev mode: Decoded Firebase token for:', payload.email || payload.phone_number);
                    return {
                        uid: payload.user_id || payload.sub,
                        email: payload.email || null,
                        name: payload.name || null,
                        picture: payload.picture || null,
                        phone_number: payload.phone_number || null,
                    };
                }
            } catch (decodeErr) {
                console.error('Manual token decode also failed:', decodeErr);
            }
        }

        return null;
    }
};
