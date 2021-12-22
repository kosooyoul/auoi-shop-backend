var config = require('./config');
var mongoConfig = config.mongo || {};

var db = require('mongoose').createConnection(mongoConfig.uris[mongoConfig.use] || mongoConfig.uris['default'], mongoConfig.options[mongoConfig.use] || mongoConfig.options['default']);
var collections = require('./Schema').get(db);

// db collections
var {
	Account,
	AccountDevice,
	Product,
	Order,
	OrderNotification,
	Notice
} = collections;

var Dao = {
	account: {
		create: async function(data) {
			return await new Account(data).save();
		},
		getBySid: async function(sid) {
			return await Account.findOne({"sid": sid})
		},
		existsBySid: async function(sid) {
			return await Account.exists({"sid": sid})
		},
		updateNameBySid: async function(sid, name) {
			const updated = await Account.updateOne({'sid': sid}, {$set: {name: name, updatedAt: new Date()}});

			return updated != 0;
		},
	},

	accountDevice: {
		create: async function(data) {
			return await new AccountDevice(data).save();
		},
		listAllByAccountSid: async function(accountSid) {
			return await AccountDevice({"accountSid": accountSid});
		},
		listAllTokenByAccountSid: async function(accountSid) {
			const accountDevices = await AccountDevice.find({"accountSid": accountSid});
			return accountDevices.map(accountDevice => accountDevice.token);
		},
		deleteById: async function(id) {
			const deleted = await AccountDevice.deleteOne({"_id": id});

			return deleted.deletedCount != 0;
		},
	},

	product: {
		create: async function(data) {
			return await new Product(data).save();
		},
		getByCode: async function(code) {
			return await Product.findOne({"code": code})
		},
		list: async function(lastId, count) {
			const matches = {};
			if (lastId) {
				matches["_id"] = {$lt: lastId};
			}

			return await Product.find(matches).sort({"_id": -1}).limit(Math.min(count || 10, 20));
		},
		decreaseAvailableStockByCode: async function(code, stock, reason) {
			const updated = await Product.updateOne({
				"code": code
			}, {
				$inc: {"availableStock": -stock},
				$push: {"reason": reason, "stock": stock}
			});

			return updated != 0;
		},
		deleteByCodeAndSellerAccountSid: async function(code, sellerAccountSid) {
			const deleted = await Product.deleteOne({"code": code, "sellerAccountSid": sellerAccountSid});

			return deleted.deletedCount != 0;
		},
		listBySellerAccountSid: async function(sellerAccountSid, lastId, count) {
			const matches = {};
			matches["sellerAccountSid"] = sellerAccountSid;
			if (lastId) {
				matches["_id"] = {$lt: lastId};
			}

			return await Product.find(matches).sort({"_id": -1}).limit(Math.min(count || 10, 20));
		},
	},

	order: {
		create: async function(data) {
			return await new Order(data).save();
		},
		getByCode: async function(code) {
			return await Order.findOne({"code": code});
		},
		listByOrdererAccountSid: async function(ordererAccountSid, lastId, count) {
			const matches = {};
			matches["ordererAccountSid"] = ordererAccountSid;
			if (lastId) {
				matches["_id"] = {$lt: lastId};
			}

			return await Order.find(matches).sort({"_id": -1}).limit(Math.min(count || 10, 20));
		},
		listBySellerAccountSid: async function(sellerAccountSid, lastId, count) {
			const matches = {};
			matches["sellerAccountSid"] = sellerAccountSid;
			if (lastId) {
				matches["_id"] = {$lt: lastId};
			}

			return await Order.find(matches).sort({"_id": -1}).limit(Math.min(count || 10, 20));
		},
	},

	orderNotification: {
		create: async function(data) {
			return await new OrderNotification(data).save();
		},
		listByReceiverAccountSid: async function(receiverAccountSid, lastId, count) {
			const matches = {};
			matches["receiverAccountSid"] = receiverAccountSid;
			if (lastId) {
				matches["_id"] = {$lt: lastId};
			}

			return await Order.find(matches).sort({"_id": -1}).limit(Math.min(count || 10, 20));
		},
	},

	notice: {
		create: async function(data) {
			return await Notice(data).save();
		},
		getById: async function(id) {
			return await Notice.findOne({"_id": id});
		},
		list: async function(lastId, count) {
			const matches = {};
			if (lastId) {
				matches["_id"] = {$lt: lastId};
			}

			return await Notice.find(matches).sort({'_id': -1}).limit(Math.min(count || 10, 20));
		},
	}
};

module.exports = Dao;
