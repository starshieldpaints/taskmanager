import React, { useEffect, useState } from 'react';
import {
    View,
    SectionList,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { firebase } from '../../firebase/config';
import TaskCard from '../../components/TaskCard';

export default function SuperAdminDashboard() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const adminsSnap = await firebase
                .firestore()
                .collection('users')
                .where('role', '==', 'admin')
                .get();

            const secs = await Promise.all(
                adminsSnap.docs.map(async (adminDoc) => {
                    const adminId = adminDoc.id;
                    const tasksSnap = await firebase
                        .firestore()
                        .collection('tasks')
                        .where('assigneeType', '==', 'admin')
                        .where('assigneeId', '==', adminId)
                        .get();

                    return {
                        title: adminDoc.data().email,
                        data: tasksSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
                    };
                })
            );

            setSections(secs);
            setLoading(false);
        })();
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
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.header}>{section.title}</Text>
                )}
                renderItem={({ item }) => <TaskCard task={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        padding: 8
    }
});
