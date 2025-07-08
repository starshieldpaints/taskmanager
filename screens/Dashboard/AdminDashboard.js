import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { FAB } from 'react-native-paper';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { AuthContext } from '../../utils/auth';
import TaskCard from '../../components/TaskCard';

export default function AdminDashboard({ navigation }) {
    const { role } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth.currentUser.uid;
        const q = query(
            collection(db, 'tasks'),
            where('assignedType', '==', 'admin'),
            where('assignedTo', '==', uid)
        );
        const unsub = onSnapshot(q, (snap) => {
            setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return unsub;
    }, []);

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
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => <TaskCard task={item} />}
            />
            {(role === 'admin' || role === 'superadmin') && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    label="Create Task"
                    onPress={() => navigation.navigate('CreateTask')}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#d32f2f' }
});
