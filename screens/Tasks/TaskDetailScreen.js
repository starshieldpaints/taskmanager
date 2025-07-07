import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { firebase } from '../../firebase/config';
import { AuthContext } from '../../utils/auth';
import CommentsSection from './CommentsSection';
import ChatRoom from '../../components/ChatRoom';
import { logAction } from '../../utils/audit';

export default function TaskDetailScreen({ route }) {
  const { taskId } = route.params;
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sub = firebase
      .firestore()
      .collection('tasks')
      .doc(taskId)
      .onSnapshot((d) => setTask({ id: d.id, ...d.data() }));
    return sub;
  }, [taskId]);

  const updateStatus = async (action) => {
    if (!task) return;
    try {
      setLoading(true);
      const newStatus =
        action === 'accept'
          ? 'inprogress'
          : action === 'complete'
          ? 'done'
          : task.status;
      await firebase
        .firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
          status: newStatus,
          remarks: firebase.firestore.FieldValue.arrayUnion({
            by: user.uid,
            text: remarks,
            at: firebase.firestore.FieldValue.serverTimestamp()
          })
        });
      await firebase.functions().httpsCallable('sendNotification')({
        userId: task.createdBy,
        type: action,
        taskId,
        message: `${user.email} ${action}ed "${task.title}"`
      });
      await logAction(`${action}Task`, { taskId, action });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!task) {
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
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.desc}>{task.description}</Text>
      <TextInput
        placeholder="Add remarks…"
        style={styles.input}
        onChangeText={setRemarks}
      />
      {['accept', 'reject', 'complete'].map((act) => (
        <Button
          key={act}
          title={act.charAt(0).toUpperCase() + act.slice(1)}
          onPress={() => updateStatus(act)}
          color="#d32f2f"
          disabled={loading}
        />
      ))}

      <CommentsSection taskId={taskId} />

      <ChatRoom taskId={taskId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    padding: 10,
    borderRadius: 4
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
