import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { firebase } from '../../firebase/config';
import { AuthContext } from '../../utils/auth';
import { logAction } from '../../utils/audit';

export default function CreateTaskScreen({ navigation }) {
  const { role, user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const doc = await firebase.firestore().collection('tasks').add({
        title,
        description: desc,
        assigneeType: role === 'superadmin' ? 'admin' : 'user',
        assigneeId: user.uid,
        createdBy: user.uid,
        status: 'todo',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await logAction('createTask', { taskId: doc.id, title });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

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
      <Button
        title={loading ? 'Creating…' : 'Create Task'}
        onPress={handleCreate}
        color="#d32f2f"
        disabled={loading}
      />
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
  }
});
