import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBZMhFaqS8Sso3732yINLjKe4hPD1nnlcM',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Connect.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Connect',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In
export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
};

// Phone OTP - Setup Recaptcha
export const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
    const verifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => { /* reCAPTCHA solved */ },
    });
    return verifier;
};

// Phone OTP - Send OTP
export const sendPhoneOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmation;
};

// Phone OTP - Verify & get token
export const verifyPhoneOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
    const result = await confirmationResult.confirm(otp);
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
};
