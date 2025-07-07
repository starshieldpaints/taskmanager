import { firebase } from '../firebase/config';

/**
 * Log every important action to /auditLogs.
 * @param {string} action   e.g. 'createTask', 'assignTask', 'completeTask'
 * @param {object} details  e.g. { taskId, to: userId }
 */
export async function logAction(action, details = {}) {
    const uid = firebase.auth().currentUser.uid;
    await firebase
        .firestore()
        .collection('auditLogs')
        .add({
            action,
            by: uid,
            at: firebase.firestore.FieldValue.serverTimestamp(),
            details,
        });
}
