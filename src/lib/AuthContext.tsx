import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { User as AppUser, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  appUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout in case Firebase auth hangs in restrictive iframes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timer);
      setCurrentUser(user);
      if (user) {
        // Unblock UI immediately so we don't get stuck on the loading screen
        setLoading(false);
        try {
          // Fetch or create app user profile
          const userRef = doc(db, 'users', user.uid);
          let appUserData: AppUser | null = null;
          
          try {
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              appUserData = userSnap.data() as AppUser;
              
              // Force admin for the specific user
              if (user.email === 'abdelbarisaoutelhak@gmail.com' && appUserData.role !== 'admin') {
                appUserData.role = 'admin';
                try {
                  await setDoc(userRef, { role: 'admin' }, { merge: true });
                } catch (e) {
                  console.warn("Could not sync admin promotion", e);
                }
              }
            }
          } catch (fetchError) {
            console.warn("Could not fetch user profile (network block). Using local/offline data.", fetchError);
          }

          if (!appUserData) {
            // Create new user profile (or fallback for offline)
            const newAppUser: AppUser = {
              id: user.uid,
              name: user.displayName || 'New Scholar',
              email: user.email || '',
              avatar: user.photoURL || '',
              role: user.email === 'abdelbarisaoutelhak@gmail.com' ? 'admin' : 'reader',
            };
            
            try {
              await setDoc(userRef, {
                ...newAppUser,
                createdAt: serverTimestamp(),
              }, { merge: true });
              
              // Also create initial progress doc
              const progressRef = doc(db, 'progress', user.uid);
              await setDoc(progressRef, {
                userId: user.uid,
                updatedAt: serverTimestamp(),
              }, { merge: true });
            } catch (writeError) {
              console.warn("Could not save user profile to local cache:", writeError);
            }
            
            appUserData = newAppUser;
          }
          
          setAppUser(appUserData);
        } catch (error) {
          console.error("Fatal error in user profile setup:", error);
          setAppUser(null);
        }
      } else {
        setAppUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      setCurrentUser(null);
      setAppUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, appUser, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
