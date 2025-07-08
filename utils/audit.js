import { auth, db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Log every important action to /auditLogs.
 * @param {string} action   e.g. 'createTask', 'assignTask', 'completeTask'
 * @param {object} details  e.g. { taskId, to: userId }
 */
export async function logAction(action, details = {}) {
    const uid = auth.currentUser.uid;
    await addDoc(collection(db, 'auditLogs'), {
        action,
        by: uid,
        at: serverTimestamp(),
        details,
    });
}
