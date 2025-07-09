import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { AuthContext } from '../../utils/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import TaskCard from '../../components/TaskCard';

export default function UserDashboard() {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'tasks'),
            where('assignedType', '==', 'user'),
            where('assignedTo', '==', user.uid)
        );
        const unsub = onSnapshot(q, (snap) => {
            setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return unsub;
    }, [user]);

    if (loading) {
        return (
            <ActivityIndicator
                style={styles.center}
                size="large"
                color="#d32f2f"
            />
        );
    }
    if (!tasks.length) {
        return (
            <View style={styles.center}>
                <Text>No assigned tasks</Text>
            </View>
        );
    }
    return (
        <FlatList
            data={tasks}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <TaskCard task={item} />}
        />
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
