import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../../utils/auth';
import { db, storage } from '../../firebase/config';

export default function EditProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null); // uri or url
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setFirstName(d.firstName || '');
        setLastName(d.lastName || '');
        setPhone(d.phone || '');
        setPhoto(d.photoURL || null);
      }
      setLoading(false);
    })();
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const save = async () => {
    try {
      setLoading(true);
      let photoURL = photo;
      if (photo && !photo.startsWith('https://')) {
        const blob = await (await fetch(photo)).blob();
        const r = ref(storage, `profilePictures/${user.uid}.jpg`);
        await uploadBytes(r, blob);
        photoURL = await getDownloadURL(r);
      }
      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        phone,
        photoURL,
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Card style={{ padding: 16 }}>
        {photo && (
          <Image source={{ uri: photo }} style={s.avatar} />
        )}
        <Button mode="outlined" onPress={pickImage} style={{ marginBottom: 16 }}>
          Change Photo
        </Button>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={s.input}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={s.input}
        />
        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          style={s.input}
        />
        <Button
          mode="contained"
          onPress={save}
          loading={loading}
          style={{ backgroundColor: '#D32F2F', marginTop: 16 }}
        >
          Save
        </Button>
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 12, backgroundColor: 'white' },
  avatar: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 16 },
});
