import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    TextInput,
    Button,
    Picker,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import { auth, db } from '../../firebase/config';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { AuthContext } from '../../utils/auth';
import { logAction } from '../../utils/audit';
import sendNotification from '../../utils/sendNotification';

export default function AssignTaskScreen() {
    const { role } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [assignedType, setAssignedType] = useState('user');
    const [assignedTo, setAssignedTo] = useState('');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, 'users'),
            where('role', '==', assignedType)
        );
        return onSnapshot(q, (snap) =>
            setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
    }, [assignedType]);

    const assign = async () => {
        try {
            setLoading(true);
            const { uid } = auth.currentUser;
            const docRef = await addDoc(collection(db, 'tasks'), {
                title,
                description: desc,
                assignedType,
                assignedTo,
                createdBy: uid,
                status: 'todo',
                createdAt: serverTimestamp()
            });
            await sendNotification({
                userId: assignedTo,
                type: 'assignment',
                taskId: docRef.id,
                message: `New Task: ${title}`,
            });
            await logAction('assignTask', { taskId: docRef.id, to: assignedTo });
            Alert.alert('Assigned!');
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
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
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                style={styles.input}
                onChangeText={setTitle}
            />
            <TextInput
                placeholder="Description"
                style={[styles.input, { height: 80 }]}
                multiline
                onChangeText={setDesc}
            />
            <Picker
                selectedValue={assignedType}
                onValueChange={setAssignedType}
            >
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
            </Picker>
            <Picker selectedValue={assignedTo} onValueChange={setAssignedTo}>
                {list.map((u) => (
                    <Picker.Item key={u.id} label={u.email} value={u.id} />
                ))}
            </Picker>
            <Button title="Assign" onPress={assign} color="#d32f2f" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 4
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
