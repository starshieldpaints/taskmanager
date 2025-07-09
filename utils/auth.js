import React, { createContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase/config';
const auth = getAuth(app);
const db = getFirestore(app);
export const AuthContext = createContext({ user: null, role: null, loading: true });

/**
 * Wrap your app in <AuthProvider> to get { user, role, loading } everywhere.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes using modular API
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if (u) {
                setUser(u);
                const snap = await getDoc(doc(db, 'users', u.uid));
                setRole(snap.exists() ? snap.data().role : 'user');
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signOut = () => fbSignOut(auth);

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}


/** Subscribe to auth changes; returns unsubscribe() */
export function listenAuth(cb) {
    return onAuthStateChanged(auth, cb);
}

/** Sign in existing user */
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/** Register new user */
export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

/** Send verification email to the currently signed-in user */
export function sendVerificationEmailToUser() {
    const u = auth.currentUser;
    if (!u) throw new Error('No user signed in.');
    return sendEmailVerification(u);
}

/** Reload the current user from server */
export function reloadCurrentUser() {
    const u = auth.currentUser;
    if (!u) throw new Error('No user signed in.');
    return reload(u);
}

/** Sign out */
export function logout() {
    return fbSignOut(auth);
}

