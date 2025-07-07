import React, { createContext, useState, useEffect } from 'react';
import { firebase } from '../firebase/config';

export const AuthContext = createContext();

/**
 * Wrap your app in <AuthProvider> to get { user, role, loading } everywhere.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = firebase.auth().onAuthStateChanged(async u => {
            setUser(u);
            if (u) {
                // Load role from Firestore
                const snap = await firebase
                    .firestore()
                    .collection('users')
                    .doc(u.uid)
                    .get();
                setRole(snap.data()?.role || '');
            } else {
                setRole('');
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
