import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    TextInput,
    Button,
    Text,
    StyleSheet
} from 'react-native';
import { auth, db } from '../firebase/config';
import {
    collection,
    doc,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import colors from '../utils/colors';

export default function ChatRoom({ taskId }) {
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const q = query(
            collection(db, 'tasks', taskId, 'chat'),
            orderBy('sentAt', 'asc')
        );
        const unsub = onSnapshot(q, (snap) =>
            setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
        return unsub;
    }, [taskId]);

    const send = async () => {
        if (!msg.trim()) return;
        await addDoc(collection(db, 'tasks', taskId, 'chat'), {
            text: msg,
            by: auth.currentUser.uid,
            sentAt: serverTimestamp(),
        });
        setMsg('');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleText}>{item.text}</Text>
                    </View>
                )}
                contentContainerStyle={styles.list}
            />
            <View style={styles.inputRow}>
                <TextInput
                    value={msg}
                    onChangeText={setMsg}
                    placeholder="Type a message…"
                    style={styles.input}
                />
                <Button title="Send" onPress={send} color={colors.primary} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.secondary },
    list: { padding: 12 },
    bubble: {
        backgroundColor: '#eee',
        padding: 8,
        borderRadius: 6,
        marginBottom: 6,
        alignSelf: 'flex-start'
    },
    bubbleText: { color: colors.accent },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        backgroundColor: colors.secondary
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 8,
        marginRight: 8,
        height: 40
    }
});
