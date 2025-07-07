import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { firebase } from '../../firebase/config';
import TaskCard from '../../components/TaskCard';

export default function TaskBoard({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = firebase
      .firestore()
      .collection('tasks')
      .onSnapshot(
        (snap) => {
          setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        },
        (err) => {
          console.warn(err);
          setLoading(false);
        }
      );
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
  if (!tasks.length) {
    return (
      <View style={styles.center}>
        <Text>No tasks</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskCard
          task={item}
          onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
