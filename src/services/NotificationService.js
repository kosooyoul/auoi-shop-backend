const firebaseAdmin = require('firebase-admin')

const googleServiceAccount = require("../firebase-admin-account.json");

const Dao = require("../database/auoi/Dao.js");

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(googleServiceAccount),
})

module.exports = {
	notify: async function(notification) {
		const tokens = await Dao.accountDevice.listAllTokenByAccountSid(notification.receiverAccountSid);

		const payload = {
			"notification": {
				title: notification.title,
				body: notification.body,
			},
			"data": {
				title: notification.title,
				body: notification.body,
				reason: "ordered",
				orderCode: notification.orderCode,
			},
			"tokens": tokens
		};

		console.log(payload);

		firebaseAdmin.messaging().sendMulticast(payload).then(function (response) {
			console.log('successfully sent message', response);
		}).catch(function (err) {
			console.log('sending message is error', err);
		});
	},
};