import { firebase } from '../firebase/config';

/**
 * Call the `sendNotification` Cloud Function.
 * @param {{userId: string, type: string, taskId: string, message: string}} payload
 */
export default function sendNotification(payload) {
  return firebase.functions().httpsCallable('sendNotification')(payload);
}
