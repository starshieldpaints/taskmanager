import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    TextInput,
    Button,
    Text,
    StyleSheet
} from 'react-native';
import { auth, db } from '../../firebase/config';
import {
    collection,
    doc,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';

export default function CommentsSection({ taskId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        const q = query(
            collection(db, 'tasks', taskId, 'comments'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snap) =>
            setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
    }, [taskId]);

    const post = async () => {
        if (!text.trim()) return;
        await addDoc(collection(db, 'tasks', taskId, 'comments'), {
            text,
            by: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });
        setText('');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <Text style={styles.comment}>{item.text}</Text>
                )}
            />
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Add a comment…"
            />
            <Button title="Post" onPress={post} color="#d32f2f" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 20 },
    comment: {
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        margin: 8,
        borderRadius: 4
    }
});
