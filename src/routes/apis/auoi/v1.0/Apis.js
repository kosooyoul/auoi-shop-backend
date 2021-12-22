const axios = require("axios");
const hashSum = require("hash-sum");
const uuid = require("uuid");
const Dao = require('../../../../database/auoi/Dao');
const Codes = require('../../../../consts/Codes');
const AuthorizationService = require("../../../../services/AuthorizationService");
const NotificationService = require("../../../../services/NotificationService");

function result(success, data, code, message) {return {success: success, data: data, code: code, message: message};}
function generateCode(prefix) {
	const minutesFrom2020 = Math.floor((Date.now() - new Date("2020-01-01")) / 1000 / 60)
	return prefix + ("00000000" + minutesFrom2020).substr(-8, 8) + "_" + ("00000000" + hashSum(uuid.v4())).substr(-8, 8);
}

var Apis = {
	'echo': async function(context, params) {
		return result(true, {'echo': params.echo}, Codes.SUCCESS, null);
	},
	'account/sid-exists': async function(context, params) {
		const exists = await Dao.account.existsBySid(params.sid);

		return result(true, {"exists": exists}, Codes.SUCCERSS, null);
	},
	'account/sign-up': async function(context, params) {
		const account = await Dao.account.create({
			"sid": params.sid,
			"password": AuthorizationService.encryptPassword(params.password),
			"name": params.name,
		})

		const accountDevice = await Dao.accountDevice.create({
			"accountSid": account.sid,
			"type": params.deviceType,
			"token": params.deviceToken,
			"ip": context.ip,
		});

		const tokenData = {
			"accountSid": account.sid,
			"accountDeviceId": accountDevice._id,
		};

		const accessToken = AuthorizationService.generateAccessToken(tokenData)
		const refreshToken = AuthorizationService.generateRefreshToken(tokenData)

		return result(true, {
			"accessToken": accessToken,
			"refreshToken": refreshToken,
		}, Codes.SUCCESS, null);
	},
	'account/sign-in': async function(context, params) {
		const account = await Dao.account.getBySid(params.sid);
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "signing-in is error, id or password is invalid");
		}

		if (AuthorizationService.comparePassword(account.password, params.password) == false) {
			return result(false, null, Codes.UNKNOWN_ERROR, "signing-in is error, id or password is invalid");
		}

		const accountDevice = await Dao.accountDevice.create({
			"accountSid": account.sid,
			"type": params.deviceType,
			"token": params.deviceToken,
			"ip": context.ip,
		});

		const tokenData = {
			"accountSid": account.sid,
			"accountDeviceId": accountDevice._id,
		};

		const accessToken = AuthorizationService.generateAccessToken(tokenData)
		const refreshToken = AuthorizationService.generateRefreshToken(tokenData)

		return result(true, {
			"accessToken": accessToken,
			"refreshToken": refreshToken,
		}, Codes.SUCCESS, null);
	},
	'account/sign-out': async function(context, params) {
		const account = context.currentAccount;
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "current account is not existing");
		}

		const deleted = await Dao.accountDevice.deleteById(context.accountDeviceId);
		if (!deleted) {
			return result(false, null, Codes.UNKNOWN_ERROR, "signing-out is error");
		}

		return result(true, {}, Codes.SUCCESS, null);
	},
	'account/sign-refresh': async function(context, params) {
		const accessTokenData = AuthorizationService.verifyAccessToken(context.accessToken, true)
		if (!accessTokenData) {
			return result(false, null, Codes.UNKNOWN_ERROR, "signing-refresh is error");
		}
		
		const refreshTokenData = AuthorizationService.verifyRefreshToken(params.refreshToken, false)
		if (!refreshTokenData) {
			return result(false, null, Codes.UNKNOWN_ERROR, "signing-refresh is error");
		}
		
		const account = await Dao.account.getBySid(refreshTokenData.accountSid);
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "signing-refresh is error");
		}

		const tokenData = {
			"accountSid": refreshTokenData.accountSid,
			"accountDeviceId": refreshTokenData.accountDeviceId,
		};

		const accessToken = AuthorizationService.generateAccessToken(tokenData)
		const refreshToken = AuthorizationService.generateRefreshToken(tokenData)

		return result(true, {
			"accessToken": accessToken,
			"refreshToken": refreshToken,
		}, Codes.SUCCESS, null);
	},
	'account/me': async function(context, params) {
		const account = context.currentAccount;
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "current account is not existing");
		}

		return result(true, {
			"sid": account.sid,
			"name": account.name,
			"createdAt": account.createdAt,
		}, Codes.SUCCESS, null);
	},
	'product/create': async function(context, params) {
		const account = context.currentAccount;
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "current account is not existing");
		}

		const product = await Dao.product.create({
			"code": generateCode("P"),
			"title": params.title,
			"description": params.description,
			"unitPrice": params.unitPrice,
			"currency": params.currency,
			"availableStock": params.availableStock,
			"stockLogs": [{
				"reason": "init",
				"stock": params.availableStock,
			}],
			"sellerAccountSid": context.currentAccountSid,
		});

		return result(true, {
			"id": product._id,
			"code": product.code,
		}, Codes.SUCCESS, null);
	},
	'product/detail': async function(context, params) {
		const product = await Dao.product.getByCode(params.code);

		return result(true, {
			"id": product._id,
			"code": product.code,
			"title": product.title,
			"description": product.description,
			"unitPrice": product.unitPrice,
			"currency": product.currency,
			"availableStock": product.availableStock,
			"isOwner": context.currentAccountSid != null && product.sellerAccountSid == context.currentAccountSid,
			"createdAt": product.createdAt,
		}, Codes.SUCCESS, null);
	},
	'product/list': async function(context, params) {
		const products = await Dao.product.list(params.lastId, params.count);

		return result(true, {'products': products.map(product => ({
			"id": product._id,
			"code": product.code,
			"title": product.title,
			"unitPrice": product.unitPrice,
			"currency": product.currency,
			"availableStock": product.availableStock,
			"isOwner": context.currentAccountSid != null && product.sellerAccountSid == context.currentAccountSid,
			"createdAt": product.createdAt,
		}))}, Codes.SUCCESS, null);
	},
	'product/list/by-seller': async function(context, params) {
		const products = await Dao.product.listBySellerAccountSid(context.currentAccountSid, params.lastId, params.count);

		return result(true, {'products': products.map(product => ({
			"id": product._id,
			"code": product.code,
			"title": product.title,
			"unitPrice": product.unitPrice,
			"currency": product.currency,
			"availableStock": product.availableStock,
			"createdAt": product.createdAt,
		}))}, Codes.SUCCESS, null);
	},
	'order/create': async function(context, params) {
		const account = context.currentAccount;
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "current account is not existing");
		}

		const product = await Dao.product.getByCode(params.productCode);
		if (!product) {
			return result(false, null, Codes.UNKNOWN_ERROR, "product is not existing");
		}
		if (product.availableStock < params.stock) {
			return result(false, null, Codes.UNKNOWN_ERROR, "available stock is not enough");
		}

		const decreased = await Dao.product.decreaseAvailableStockByCode(product.code, params.stock, "ordered");
		if (!decreased) {
			return result(false, null, Codes.UNKNOWN_ERROR, "updating available stock is error");
		}

		const order = await Dao.order.create({
			"code": generateCode("O"),
			"productCode": product.code,
			"product": {
				"title": product.title,
				"unitPrice": product.unitPrice,
				"currency": product.currency,
			},
			"orderedStock": params.stock,
			"status": "ordered",
			"stockLogs": [{
				"status": "ordered",
			}],
			"ordererAccountSid": context.currentAccountSid,
			"ordererAccountName": context.currentAccount.name,
			"sellerAccountSid": product.sellerAccountSid,
		});

		const orderNotification = await Dao.orderNotification.create({
			"receiverAccountSid": product.sellerAccountSid,
			"orderCode": order.code,
			"title": "상품 '" + product.title + "' x " + order.orderedStock + " 주문들어왔어요!",
			"body": "오예~! 상품 '" + product.title + "' x " + order.orderedStock + ", 주문 '" + order.code + "' 어서 확인해주세요!",
		});

		// No await
		NotificationService.notify(orderNotification);

		return result(true, {
			"id": order._id,
			"code": order.code,
		}, Codes.SUCCESS, null);
	},
	'order/list/by-orderer': async function(context, params) {
		const account = context.currentAccount;
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "current account is not existing");
		}

		const orders = await Dao.order.listByOrdererAccountSid(account.sid, params.lastId, params.count);

		return result(true, {'orders': orders.map(order => ({
			"id": order._id,
			"code": order.code,
			"productCode": order.productCode,
			"product": order.product,
			"orderedStock": order.orderedStock,
			"status": order.status,
			"ordererAccountSid": order.ordererAccountSid,
			"ordererAccountName": order.ordererAccountName,
			"sellerAccountSid": order.sellerAccountSid,
			"createdAt": order.createdAt,
		}))}, Codes.SUCCESS, null);
	},
	'order/list/by-seller': async function(context, params) {
		const account = context.currentAccount;
		if (!account) {
			return result(false, null, Codes.UNKNOWN_ERROR, "current account is not existing");
		}

		const orders = await Dao.order.listBySellerAccountSid(account.sid, params.lastId, params.count);

		return result(true, {'orders': orders.map(order => ({
			"id": order._id,
			"code": order.code,
			"productCode": order.productCode,
			"product": order.product,
			"orderedStock": order.orderedStock,
			"status": order.status,
			"ordererAccountSid": order.ordererAccountSid,
			"ordererAccountName": order.ordererAccountName,
			"sellerAccountSid": order.sellerAccountSid,
			"createdAt": order.createdAt,
		}))}, Codes.SUCCESS, null);
	},
	'notice/detail': async function(context, params) {
		const notice = await Dao.notice.getById(params.id);
		if (!notice) {
			return result(false, null, Codes.UNKNOWN_ERROR, "notice is not existing");
		}

		return result(true, {
			"id": notice._id,
			"title": notice.title,
			"content": notice.content,
			"createdAt": notice.createdAt,
		}, Codes.SUCCESS, null);
	},
	'notice/list': async function(context, params) {
		const notices = await Dao.notice.list(params.lastId, params.count);

		return result(true, {"notices": notices.map(notice => ({
			"id": notice._id,
			"title": notice.title,
			"createdAt": notice.createdAt,
		}))}, Codes.SUCCESS, null);
	},
};

module.exports = Apis;
