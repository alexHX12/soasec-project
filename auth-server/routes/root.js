var express = require('express');
var router = express.Router();
var auth=require('../controller/auth')

router.get('/auth', auth.authUser);
router.post('/signin', auth.signIn);
router.post('/token', auth.getToken);

module.exports = router;
