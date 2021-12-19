module.exports = {
	API_NAME: 'Auoi',
	API_PORT: 65000,
	STATIC_PORT: 65100,
	HOST: 'https://apis.shop.auoi.net',
	PASSWORD_ENCRYPTION_KEY: "(password)",
	TOKEN_ACCESS_PRIVATE_KEY: "(access)",
	TOKEN_ACCESS_ENCRYPTION_KEY: "(access)",
	TOKEN_ACCESS_EXPIRES_IN: 60 * 60 * 1, // 1h
	TOKEN_REFRESH_PRIVATE_KEY: "(refresh)",
	TOKEN_REFRESH_ENCRYPTION_KEY: "(refresh)",
	TOKEN_REFRESH_EXPIRES_IN: 60 * 60 * 24 * 7, // 7d
};