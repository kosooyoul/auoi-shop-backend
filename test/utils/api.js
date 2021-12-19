const request = require("request");
const beautify = require("json-beautify");

async function check(endpoint, input, headers, cookies) {
	return new Promise((resolve, reject) => {
		request({
			method: "POST",
			url: endpoint,
			body: input || undefined,
			json: true,
			headers: {
				... headers,
				"Cookie": cookies && Object.keys(cookies).map(function(key) {return key + "=" + cookies[key]}).join(";")
			}
		}, function(err, response, body) {
			console.log([
				"<<Input>>",
				beautify(input, null, 2, 40),
				"",
				"<<Result>>",
				beautify(body, null, 2, 40),
				""
			].join("\n"));
			resolve(body);
		});
	});
}

module.exports = {
	check: check
}