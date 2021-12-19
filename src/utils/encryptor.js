var aes256 = require('aes256');

module.exports = {
	encrypt: function(obj, seckey) {
		try {
			obj.ts = Date.now();
			return aes256.encrypt(seckey, JSON.stringify(obj));
		} catch (e) {
			return null;
		}
	},
	decrypt: function(data, seckey) {
		try {
			return JSON.parse(aes256.decrypt(seckey, data));
		} catch (e) {
			return null;
		}
	}
};