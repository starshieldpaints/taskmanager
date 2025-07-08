import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../utils/auth';
import { db } from '../../firebase/config';
import sendNotification from '../../utils/sendNotification';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'tasks', taskId));
        if (snap.exists()) {
          setTask({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load task');
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId]);

  async function changeStatus(newStatus) {
    if (!task) return;
    try {
      setLoading(true);
      await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
      setTask((t) => ({ ...t, status: newStatus }));

      const message = `Task "${task.title}" is now ${newStatus}`;
      await sendNotification({ userId: task.createdBy, taskId, type: 'status', message });
      if (task.assignedTo) {
        await sendNotification({ userId: task.assignedTo, taskId, type: 'status', message });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={s.center}><ActivityIndicator size="large" color="#d32f2f" /></View>
    );
  }
  if (!task) {
    return (
      <View style={s.center}><Text>Task not found.</Text></View>
    );
  }

  const isAssignee = user?.uid === task.assignedTo;
  const isCreator = user?.uid === task.createdBy;

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>{task.title}</Text>
      <Text style={s.label}>Description:</Text>
      <Text>{task.desc}</Text>
      <Text style={s.label}>Deadline:</Text>
      <Text>{task.deadline?.toDate().toLocaleString()}</Text>
      <Text style={s.label}>Status:</Text>
      <Text>{task.status}</Text>

      {task.status === 'todo' && (
        <View style={s.actions}>
          {isAssignee && (
            <>
              <Button title="Start" onPress={() => changeStatus('inprogress')} />
              <Button title="Complete" onPress={() => changeStatus('done')} />
            </>
          )}
          {isCreator && (
            <Button title="Cancel" onPress={() => changeStatus('cancelled')} />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  label: { marginTop: 12, fontWeight: '600' },
  actions: { marginTop: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
