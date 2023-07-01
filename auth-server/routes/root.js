var express = require('express');
var router = express.Router();
var auth=require('../controller/auth')
var register=require('../controller/register')

const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '.' + file.originalname.split('.')[1]);
  }
});

const upload = multer({ storage: storage });

router.get('/auth', auth.authUser);
router.post('/signin', auth.signIn);
router.post('/approve-scopes', auth.approveScopes);
router.post('/token', auth.getToken);
router.post('/m2m-token', auth.getM2MToken);
router.get('/logout', auth.logout);
router.get('/app-register',register.registerApp);
router.post('/app-register',register.registerAppBackend);
router.get('/m2m-register',register.registerM2M);
router.post('/m2m-register',register.registerM2MBackend);
router.get('/user-register',register.registerUser);
router.post('/user-register',upload.single('image'),register.registerUserBackend)

module.exports = router;
