var express = require('express');
var router = express.Router();

var Apis = require('./Apis');
var Context = require('./Context');
var Codes = require('../../../../consts/Codes');

async function postController(req, res, next) {
	const apiName = req.params.apiName;
	const api = Apis[apiName];
	if (!api) {
		return res.json({'success': false, 'code': Codes.NOT_FOUND, 'message': 'not found api'});
	}

	const context = await Context.get(req);
	
	const appName = context.appid || "Anonymous";
	const params = req.body;

	// call api function
	try {
		const result = await api(context, params);
		res.json(result);

		console.log(new Date(), 'App.' + appName + ' call API.' + "AuoiShop" + '.' + apiName + ', Responsed: ' + JSON.stringify({'code': result.code, 'message': result.message, 'success': result.success}));
	} catch (e) {
		res.json({'success': false, 'code': Codes.UNKNOWN_ERROR, 'message': 'error'});

		console.log(new Date(), 'App.' + appName + ' call API.' + "AuoiShop" + '.' + apiName + ', Error: ' + e.message);
	}
}

// Post API 1 Depth
router.post('/:name1', async function(req, res, next) {
	req.params.apiName = req.params.name1;
	await postController(req, res, next);
});

// Post API 2 Depth
router.post('/:name1/:name2', async function(req, res, next) {
	req.params.apiName = req.params.name1 + '/' + req.params.name2;
	await postController(req, res, next);
});

// Post API 3 Depth
router.post('/:name1/:name2/:name3', async function(req, res, next) {
	req.params.apiName = req.params.name1 + '/' + req.params.name2 + '/' + req.params.name3;
	await postController(req, res, next);
});

// Post API 4 Depth
router.post('/:name1/:name2/:name3/:name4', async function(req, res, next) {
	req.params.apiName = req.params.name1 + '/' + req.params.name2 + '/' + req.params.name3 + '/' + req.params.name4;
	await postController(req, res, next);
});

// Post API 5 Depth
router.post('/:name1/:name2/:name3/:name4/:name5', async function(req, res, next) {
	req.params.apiName = req.params.name1 + '/' + req.params.name2 + '/' + req.params.name3 + '/' + req.params.name4 + '/' + req.params.name5;
	await postController(req, res, next);
});

// Get API
router.get('/:apiName', async function(req, res, next) {
	return res.json({'success': false, 'code': Codes.NOT_FOUND, 'message': 'not found api'});
});

module.exports = router;