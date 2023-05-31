var express = require('express');
var router = express.Router();
var author=require("../controller/author_c")

// /authors
router.get('/',author.getAuthors);

module.exports = router;
