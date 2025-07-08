import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    SectionList,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { FAB } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../../utils/auth';
import TaskCard from '../../components/TaskCard';

export default function SuperAdminDashboard({ navigation }) {
    const { role } = useContext(AuthContext);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const adminsSnap = await getDocs(
                query(collection(db, 'users'), where('role', '==', 'admin'))
            );

            const secs = await Promise.all(
                adminsSnap.docs.map(async (adminDoc) => {
                    const adminId = adminDoc.id;
                    const tasksSnap = await getDocs(
                        query(
                            collection(db, 'tasks'),
                            where('assignedType', '==', 'admin'),
                            where('assignedTo', '==', adminId)

                        )
                    );

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
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        padding: 8
    },
    fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#d32f2f' }
});
