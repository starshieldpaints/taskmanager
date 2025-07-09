import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../utils/auth';
import { db } from '../firebase/config';

export default function ProfileScreen({ navigation }) {
    const { user, role, signOut } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        (async () => {
            if (user) {
                const snap = await getDoc(doc(db, 'users', user.uid));
                if (snap.exists()) setProfile(snap.data());
            }
        })();
    }, [user]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => navigation.navigate('EditProfile')} color="#fff">
                    Edit
                </Button>
            )
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            {profile?.photoURL && (
                <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
            )}
            <Text style={styles.text}>Email: {user?.email}</Text>
            <Text style={styles.text}>Name: {profile?.firstName} {profile?.lastName}</Text>
            <Text style={styles.text}>Phone: {profile?.phone}</Text>
            <Text style={styles.text}>Role: {role}</Text>

            <Button
                mode="contained"
                onPress={signOut}
                style={{ marginTop: 20, backgroundColor: '#d32f2f' }}
            >
                Logout
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    text: { fontSize: 16, marginBottom: 12 },
    avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 }
});
