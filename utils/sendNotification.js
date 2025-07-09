import { httpsCallable, getFunctions } from 'firebase/functions';
import { app } from '../firebase/config';

/**
 * Call the `sendNotification` Cloud Function.
 * @param {{userId: string, type: string, taskId: string, message: string}} payload
 */
export default function sendNotification(payload) {
  const fn = httpsCallable(getFunctions(app), 'sendNotification');
  return fn(payload);
}
