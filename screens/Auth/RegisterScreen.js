import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import * as ImagePicker from 'expo-image-picker';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebase } from '../../firebase/config';

export default function RegisterScreen({ navigation }) {
  const recaptchaVerifier = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!phone) {
      Alert.alert('Error', 'Enter phone number');
      return;
    }
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const id = await phoneProvider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current
      );
      setVerificationId(id);
      Alert.alert('Verification code sent');
    } catch (e) {
      Alert.alert('Phone Error', e.message);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required to access photo library');

      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required to access camera');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,

    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const validateEmail = (val) => /.+@.+\..+/.test(val);

  const handleRegister = async () => {
    if (!firstName || !lastName || !designation || !phone || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!verificationId) {
      Alert.alert('Error', 'Verify phone number first');
      return;
    }
    if (!verificationCode) {
      Alert.alert('Error', 'Enter phone verification code');
      return;
    }

    setLoading(true);
    try {
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await user.sendEmailVerification();

      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await user.linkWithCredential(credential);

      let photoURL = null;
      if (image) {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`profiles/${user.uid}.jpg`);
        await ref.put(blob);
        photoURL = await ref.getDownloadURL();
      }

      await firebase.firestore().collection('users').doc(user.uid).set({
        firstName,
        lastName,
        designation,
        phone,
        email,
        photoURL,
        role: 'user',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      navigation.replace('Verify');
    } catch (e) {
      Alert.alert('Registration Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
        attemptInvisibleVerification
      />
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Designation"
        value={designation}
        onChangeText={setDesignation}
        style={styles.input}
      />
      <PhoneInput
        defaultCode="IN"
        containerStyle={{ marginBottom: 12 }}
        textContainerStyle={{ paddingVertical: 0 }}
        value={phone}
        onChangeFormattedText={setPhone}
      />
      <Button title="Send Code" onPress={sendCode} />
      {verificationId && (
        <TextInput
          placeholder="Verification Code"
          keyboardType="number-pad"
          value={verificationCode}
          onChangeText={setVerificationCode}
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
        <Text style={{ color: '#fff' }}>Pick Profile Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
        <Text style={{ color: '#fff' }}>Take Photo</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, marginBottom: 12 }} />
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" />
      ) : (
        <Button title="Register" onPress={handleRegister} color="#d32f2f" />
      )}
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 4
  },
  photoButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12
  }
});
