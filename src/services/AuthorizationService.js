var jwt = require('jsonwebtoken');
var encryptor = require('../utils/encryptor.js');
var base64 = require('../utils/base64.js');

var config = require('../config');
const { UserRefreshClient } = require('google-auth-library');

const PASSWORD_ENCRYPTION_KEY = config.PASSWORD_ENCRYPTION_KEY;

const TOKEN_ACCESS_PRIVATE_KEY = config.TOKEN_ACCESS_PRIVATE_KEY;
const TOKEN_ACCESS_ENCRYPTION_KEY = config.TOKEN_ACCESS_ENCRYPTION_KEY;
const TOKEN_ACCESS_EXPIRES_IN = config.TOKEN_ACCESS_EXPIRES_IN;

const TOKEN_REFRESH_PRIVATE_KEY = config.TOKEN_REFRESH_PRIVATE_KEY;
const TOKEN_REFRESH_ENCRYPTION_KEY = config.TOKEN_REFRESH_ENCRYPTION_KEY;
const TOKEN_REFRESH_EXPIRES_IN = config.TOKEN_REFRESH_EXPIRES_IN;

module.exports = {
	encryptPassword: function(password) {
		const encryptedPassword = encryptor.encrypt(password, PASSWORD_ENCRYPTION_KEY);
		return base64.encode(encryptedPassword);
	},
	comparePassword: function(encryptedPassword, password) {
		const decodedEncryptedPassword = base64.decode(encryptedPassword);
		const decryptedPassword = encryptor.decrypt(decodedEncryptedPassword, PASSWORD_ENCRYPTION_KEY);
		console.log("decodedEncryptedPassword", decryptedPassword)
		return decryptedPassword == password;
	},
	generateAccessToken: function(data) {
		const rawToken = jwt.sign({... data, "type": "access"}, TOKEN_ACCESS_PRIVATE_KEY, {expiresIn: TOKEN_ACCESS_EXPIRES_IN});
		const encryptedToken = encryptor.encrypt(rawToken, TOKEN_ACCESS_ENCRYPTION_KEY);
		return base64.encode(encryptedToken);
	},
	verifyAccessToken: function(token, ignoreExpired = false) {
		const encryptedToken = base64.decode(token);
		const rawToken = encryptor.decrypt(encryptedToken, TOKEN_ACCESS_ENCRYPTION_KEY);
		try {
			let data = null;
			if (ignoreExpired) {
				data = jwt.decode(rawToken, TOKEN_ACCESS_PRIVATE_KEY);
			} else {
				data = jwt.verify(rawToken, TOKEN_ACCESS_PRIVATE_KEY);
			}
			
			if (!data) {
				return null;
			}
			if (data.type != "access") {
				return null;
			}
			return data;
		} catch (e) {
			// Do nothing
		}
		return null;
	},
	generateRefreshToken: function(data) {
		const rawToken = jwt.sign({... data, "type": "refresh"}, TOKEN_REFRESH_PRIVATE_KEY, {expiresIn: TOKEN_REFRESH_EXPIRES_IN});
		const encryptedToken = encryptor.encrypt(rawToken, TOKEN_REFRESH_ENCRYPTION_KEY);
		return base64.encode(encryptedToken);
	},
	verifyRefreshToken: function(token, ignoreExpired = false) {
		const encryptedToken = base64.decode(token);
		const rawToken = encryptor.decrypt(encryptedToken, TOKEN_REFRESH_ENCRYPTION_KEY);
		try {
			let data = null;
			if (ignoreExpired) {
				data = jwt.decode(rawToken, TOKEN_REFRESH_PRIVATE_KEY);
			} else {
				data = jwt.verify(rawToken, TOKEN_REFRESH_PRIVATE_KEY);
			}

			if (!data) {
				return null;
			}
			if (data.type != "refresh") {
				return null;
			}
			return data;
		} catch (e) {
			// Do nothing
		}
		return null;
	},
};