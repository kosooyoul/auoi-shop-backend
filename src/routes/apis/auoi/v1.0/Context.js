const Dao = require('../../../../database/auoi/Dao');
const AuthorizationService = require('../../../../services/AuthorizationService');

var context = {
	get: async function(req) {
		var context = req.context;
		context.ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;

		// 사용자 인증 확인
		const accessToken = req.headers["authorization"];
		context.accessToken = accessToken;

		if (accessToken) {
			const tokenData = AuthorizationService.verifyAccessToken(accessToken, false);
			if (tokenData) {
				const account = await Dao.account.getBySid(tokenData.accountSid);
				context.currentAccount = account;
				context.currentAccountSid = account.sid;
				context.accountDeviceId = tokenData.accountDeviceId;
			}
		}

		return context;
	}
};

module.exports = context;
