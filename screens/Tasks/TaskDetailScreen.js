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
import sendNotification from '../../utils/sendNotification';

import { AuthContext } from '../../utils/auth';
import sendNotification from '../../utils/sendNotification';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const db = getFirestore();
  const { user, role } = useContext(AuthContext);

  const [task, setTask] = useState(null);

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
      await sendNotification({
        userId: task.createdBy,
        type: action,
        taskId,
        message: `${user.email} ${action}ed "${task.title}"`,
      });
      await logAction(`${action}Task`, { taskId, action });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);

    }

    navigation.goBack();
  }

  return (
    <ScrollView style={s.container}>
      <Card>
        <Card.Title
          title={task.title}
          subtitle={`Status: ${task.status.toUpperCase()}`}
        />
        <Card.Content>
          <Text>Description:</Text>
          <Text>{task.desc}</Text>
          <Text>Deadline: {task.deadline.toDate().toLocaleString()}</Text>
          <Text>Assigned by: {task.createdBy}</Text>
          <Text>Assigned to: {task.assignedTo}</Text>
        </Card.Content>
        <Card.Actions>
          {isAssignee && task.status === 'todo' && (
            <>
              <Button onPress={() => changeStatus('inprogress')}>Start</Button>
              <Button onPress={() => changeStatus('done')}>Complete</Button>
            </>
          )}
          {isCreator && task.status === 'todo' && (
            <Button onPress={() => changeStatus('cancelled')}>Cancel</Button>
          )}
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
});
