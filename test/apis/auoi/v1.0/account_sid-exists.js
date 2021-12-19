const api = require('../../../utils/api');

api.check(
	'http://localhost:65000/v1.0/account/sid-exists',
	{
		"sid": "hanulse",
	}
)