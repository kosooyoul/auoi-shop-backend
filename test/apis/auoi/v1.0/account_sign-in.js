const api = require('../../../utils/api');

api.check(
	'http://localhost:65000/v1.0/account/sign-in',
	{
		"sid": "hanulse",
		"password": "a123456!",
		"deviceType": "android",
		"deviceToken": "cK_2c4HsRgyPc3gzbJhfAS:APA91bFK0kwke_eVvBWMYHl0rdzfMowT-RQWnBDKi5IZ8p6m3tmzzLL1tXGiN2Cs-qXr78bz2dEVQWnceqGxtk9ll67xumDTAjUHFbUldvi1YuJygDm5x0OeqT63OxMBYdPLJf2H9RO0",
	}
)