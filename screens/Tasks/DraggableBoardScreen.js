import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { firebase } from '../../firebase/config';
import DraggableTaskBoard from '../../components/DraggableTaskBoard';

export default function DraggableBoardScreen() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = firebase
            .firestore()
            .collection('tasks')
            .onSnapshot((snap) => {
                setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
                setLoading(false);
            });
        return unsub;
    }, []);

    const handleReorder = (newOrder) => {
        setTasks(newOrder);
        // optionally persist order changes here
    };

    if (loading) {
        return (
            <ActivityIndicator
                style={styles.center}
                size="large"
                color="#d32f2f"
            />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <DraggableTaskBoard data={tasks} onDragEnd={handleReorder} />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
