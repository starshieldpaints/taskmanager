import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Button,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { firebase } from '../../firebase/config';
import TaskCard from '../../components/TaskCard';

export default function AdminDashboard({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = firebase.auth().currentUser.uid;
        const unsub = firebase
            .firestore()
            .collection('tasks')
            .where('assigneeType', '==', 'admin')
            .where('assigneeId', '==', uid)
            .onSnapshot((snap) => {
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
            <Button
                title="Create Task"
                onPress={() => navigation.navigate('CreateTask')}
                color="#d32f2f"
            />
            <FlatList
                data={tasks}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => <TaskCard task={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
