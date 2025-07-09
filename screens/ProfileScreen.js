import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../utils/auth';

export default function ProfileScreen() {
    const { user, role, signOut } = useContext(AuthContext);


    return (
        <View style={styles.container}>
            <Text>Email: {user?.email}</Text>
            <Text>Role: {role}</Text>
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
    text: { fontSize: 16, marginBottom: 12 }
});
