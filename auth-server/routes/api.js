var express = require('express');
var router = express.Router();
var userinfo=require('../controller/api/userinfo')

router.get('/userinfo', userinfo.getUserInfo);

module.exports = router;
