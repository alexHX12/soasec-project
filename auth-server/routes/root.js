var express = require('express');
var router = express.Router();
var auth=require('../controller/auth')
var register=require('../controller/register')

router.get('/auth', auth.authUser);
router.post('/signin', auth.signIn);
router.post('/token', auth.getToken);
router.post('/m2m-token', auth.getM2MToken);
router.get('/logout', auth.logout);
router.get('/app-register',register.registerApp);
router.post('/app-register',register.registerAppBackend);
router.get('/m2m-register',register.registerM2M);
router.post('/m2m-register',register.registerM2MBackend);
router.get('/user-register',register.registerUser);
router.post('/user-register',register.registerUserBackend)

module.exports = router;
