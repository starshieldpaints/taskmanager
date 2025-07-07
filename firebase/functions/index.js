const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotification = functions.https.onCall(async (data, context) => {
    const { userId, type, taskId, message } = data;

    // 1) Write a Firestore notification document
    await admin.firestore().collection('notifications').add({
        userId,
        type,
        taskId,
        message,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2) Fetch user's FCM token and send a push if available
    const uSnap = await admin.firestore().collection('users').doc(userId).get();
    const token = uSnap.exists ? uSnap.data().fcmToken : null;
    if (token) {
        await admin.messaging().sendToDevice(token, {
            notification: { title: 'Task Update', body: message },
            data: { taskId, type }
        });
    }

    return { success: true };
});
