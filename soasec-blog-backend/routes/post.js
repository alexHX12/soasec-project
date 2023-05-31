var express = require('express');
var router = express.Router();
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
var post=require("../controller/post_c");

// /posts
router.get('/',post.getPosts);
router.get('/:id',post.getSinglePost);
router.post('/',upload.single('image'),post.addPost);

module.exports = router;
