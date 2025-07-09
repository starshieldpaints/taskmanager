import * as Notifications from 'expo-notifications';
import { auth, db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

/**
 * Register with Expo Notifications and save the push token to Firestore.
 */
export async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Ask if not already granted
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Failed to get push token permission!');
        return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // Save to Firestore
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', uid), { fcmToken: token });

    // Android only: set channel
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

/**
 * Schedule a local reminder notification.
 * @param {string} taskId
 * @param {{ hour: number, minute: number, repeats: boolean }} trigger
 */
export async function scheduleTaskReminder(taskId, trigger) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Task Reminder',
            body: `Reminder for task: ${taskId}`,
            data: { taskId },
        },
        trigger,
    });
}

