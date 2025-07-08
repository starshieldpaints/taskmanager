// import React, { createContext, useState, useEffect } from 'react';
// import { firebase } from '../firebase/config';

// export const AuthContext = createContext();

// /**
//  * Wrap your app in <AuthProvider> to get { user, role, loading } everywhere.
//  */
// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [role, setRole] = useState('');
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Listen for auth state changes
//         const unsubscribe = firebase.auth().onAuthStateChanged(async u => {
//             setUser(u);
//             if (u) {
//                 // Load role from Firestore
//                 const snap = await firebase
//                     .firestore()
//                     .collection('users')
//                     .doc(u.uid)
//                     .get();
//                 setRole(snap.data()?.role || '');
//             } else {
//                 setRole('');
//             }
//             setLoading(false);
//         });
//         return unsubscribe;
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, role, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
// utils/auth.js

// utils/auth.js
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    reload,
    signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';

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
    return signOut(auth);
}
