const api = require('../../../utils/api');

api.check(
	'http://localhost:65000/v1.0/notice/list',
	{
		// "lastId": "61bf025caa9beb01cd455e7f",
		"count": 5,
	}
)