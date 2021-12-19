const api = require('../../../utils/api');

api.check(
	'http://localhost:65000/v1.0/product/create',
	{
		"title": "대추야자",
		"description": "사우디아라비아산 대추야자. 영양만점 대추야자 요플레에 넣어 드셔도 되고, 디저트 어디에 넣어 드셔도 좋아요~",
		"unitPrice": 10000,
		"currency": "krw",
		"availableStock": 30,
	},
	{
		"authorization": "MW1KOWtKRmZaY2pQWmY1dWJSelJVa3FoOGRHT2pXUWVYVlAyTmZ2NXVMZjlWZWwrbEVsOTFCcjg1YWFXcUYzWXpKVXVXSjMxeEJBUUk4alNOUkVBcFJ2QWRvS3hzZGRvb1A1T3hPYXB0ZjIzaDh4RElzUDRsaUh1SHIrK3puSVduNjdBZ2RPTWJtWUxQS3AvTitBYXI0VWV6Z3dEbEVibzlLazNhYlU0TmRwaUprdWdoNUx4NnRiV2h6S2pnNit0ZXN6UGZ1Q2ozS2UwWGFCVkFHT0xFanVRc2ViNE4zSmlvSHR6bWZaeXdHYjBoUWw4MW8xbXhVck16NGFWTjlhS2I2TEVEL0FSczZhMi81c3R2K0JJaUErWWo4UGN1Y1R2S0IvL0U4SVRmNUNrZXZtNzdHcWNxSFVpdXdQK2NBK2VyalhwNUdJVjFZNUNETWlsbklDRHpBVmE=",
	}
)