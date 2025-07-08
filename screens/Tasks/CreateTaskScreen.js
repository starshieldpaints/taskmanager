import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  Text,
  Button,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../../utils/auth';
import sendNotification from '../../utils/sendNotification';

export default function CreateTaskScreen({ navigation }) {
  const { user, role } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assigneeType, setAssigneeType] = useState('user');
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (role === 'superadmin') {
      (async () => {
        const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'admin')));
        setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })();

      (async () => {
        const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'user')));
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })();
    } else if (role === 'admin') {
      (async () => {
        const snap = await getDocs(
          query(collection(db, 'users'), where('adminId', '==', user.uid))
        );
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })();
    }
  }, [role, user]);

  async function onSubmit() {
    const assigneeId = assigneeType === 'admin' ? selectedAdmin : selectedUser;
    if (!title || !assigneeId) return;

    const taskRef = await addDoc(collection(db, 'tasks'), {
      title,
      desc,
      status: 'todo',
      deadline,
      createdBy: user.uid,
      assignedType: assigneeType,
      assignedTo: assigneeId,
      createdAt: serverTimestamp(),
    });

    // notify the assignee
    await sendNotification({
      userId: assigneeId,
      taskId: taskRef.id,
      type: 'assigned',
      message: `New task "${title}" assigned to you.`
    });

    // if superadmin → user, also notify that user’s admin
    if (role === 'superadmin' && assigneeType === 'user') {
      const adminOfUser = users.find(u => u.id === assigneeId)?.adminId;
      if (adminOfUser) {
        await sendNotification({
          userId: adminOfUser,
          taskId: taskRef.id,
          type: 'assigned',
          message: `Your user has a new task: "${title}".`
        });
      }
    }

    navigation.goBack();
  }

  return (
    <ScrollView style={s.container}>
      <Text style={s.header}>Create New Task</Text>

      <TextInput
        placeholder="Title"
        style={s.input}
        value={title} onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        style={[s.input, { height: 80 }]}
        value={desc} onChangeText={setDesc}
        multiline
      />

      <Text style={s.label}>Assign to:</Text>
      <RadioButton.Group onValueChange={setAssigneeType} value={assigneeType}>
        {role === 'superadmin' && (
          <View style={s.radioRow}>
            <RadioButton value="admin" /><Text>Admin</Text>
          </View>
        )}
        <View style={s.radioRow}>
          <RadioButton value="user" /><Text>User</Text>
        </View>
      </RadioButton.Group>

      {assigneeType === 'admin' &&
        admins.map((a) => (
          <View key={a.id} style={s.selectBtn}>
            <Button
              title={a.name || a.email}
              color={selectedAdmin === a.id ? '#D32F2F' : undefined}
              onPress={() => setSelectedAdmin(a.id)}
            />
          </View>
        ))}

      {assigneeType === 'user' &&
        users.map((u) => (
          <View key={u.id} style={s.selectBtn}>
            <Button
              title={u.name || u.email}
              color={selectedUser === u.id ? '#D32F2F' : undefined}
              onPress={() => setSelectedUser(u.id)}
            />
          </View>
        ))}

      <Text style={s.label}>Deadline:</Text>
      <Button
        title={`${deadline.toLocaleDateString()} ${deadline.toLocaleTimeString()}`}
        onPress={() => setShowPicker(true)}
        color="#D32F2F"
      />
      {showPicker && (
        <DateTimePicker
          value={deadline}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, d) => {
            setShowPicker(Platform.OS === 'ios');
            if (d) setDeadline(d);
          }}
        />
      )}

      <View style={s.submitBtn}>
        <Button title="Create Task" onPress={onSubmit} color="#D32F2F" />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#D32F2F' },
  label: { marginTop: 12, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 6, padding: 8, marginVertical: 6 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  selectBtn: { marginVertical: 4 },
  submitBtn: { marginTop: 24 },
});
