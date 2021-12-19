module.exports = {
	mongo: {
		name: 'AuoiDatabase',
		use: 'private',
		uris: {
			'local': 'mongodb://localhost/auoi',
			'private': 'mongodb://127.0.0.1:50000/auoi',
		},
		options: {
			'default': {
				useNewUrlParser: true,
				useCreateIndex: true,

				auto_reconnect: true,

				connectTimeoutMS: 3600000,
				keepAlive: 3600000,
				socketTimeoutMS: 3600000,

				// retryMiliSeconds: 1000,
				numberOfRetries: 10,

				useUnifiedTopology: true
			}
		}
	}
};
