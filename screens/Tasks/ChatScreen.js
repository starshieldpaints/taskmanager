import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChatRoom from '../../components/ChatRoom';

export default function ChatScreen({ route }) {
    const { taskId } = route.params;
    return (
        <View style={styles.container}>
            <ChatRoom taskId={taskId} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' }
});
