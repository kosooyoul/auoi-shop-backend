const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
	res.json({
        "success": "true",
        "apis": [
            {"name": "auoi", "version": "v1.0"}
        ]
    });
});

module.exports = router;