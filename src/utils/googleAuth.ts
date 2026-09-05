import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
];

// Initialize or reuse Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with all Google Drive requested scopes
const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => {
  provider.addScope(scope);
});
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline'
});

// Flag to track interactive sign-in flow
let isSigningIn = false;

// In-memory token cache (strictly NOT stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Auth state listeners list
type AuthCallback = (user: User | null, token: string | null) => void;
const listeners: Set<AuthCallback> = new Set();

const notifyListeners = (user: User | null, token: string | null) => {
  listeners.forEach((listener) => {
    try {
      listener(user, token);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
};

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
    cachedUser = user;
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        notifyListeners(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User is signed in with Firebase session, but accessToken requires re-authentication popup for Google Workspace APIs
        if (onAuthFailure) onAuthFailure();
        notifyListeners(user, null);
      }
    } else {
      cachedAccessToken = null;
      cachedUser = null;
      if (onAuthFailure) onAuthFailure();
      notifyListeners(null, null);
    }
  });

  return unsubscribe;
};

// Subscribe to auth state updates
export const subscribeAuth = (callback: AuthCallback) => {
  listeners.add(callback);
  callback(cachedUser, cachedAccessToken);
  return () => {
    listeners.delete(callback);
  };
};

// Interactive Google Sign-In with popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive OAuth access token from Google sign-in.');
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    notifyListeners(result.user, cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Get current in-memory access token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Get current user
export const getCurrentUser = (): User | null => {
  return cachedUser;
};

// Check if user has an active Drive token
export const hasDriveAuth = (): boolean => {
  return Boolean(cachedAccessToken && cachedUser);
};

// Sign out and clear in-memory token cache
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
    cachedUser = null;
    notifyListeners(null, null);
  }
};
