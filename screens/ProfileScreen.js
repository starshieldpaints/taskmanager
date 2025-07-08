import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../utils/auth';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
    const { user, role } = useContext(AuthContext);

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Role: {role}</Text>
            <Button title="Logout" onPress={handleLogout} color="#d32f2f" />
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
    text: { fontSize: 16, marginBottom: 12 }
});
