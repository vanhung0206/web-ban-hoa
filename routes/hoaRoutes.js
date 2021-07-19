var express = require("express");
var router = express.Router();
var home = require("../controllers/homeController");
/* GET home page. */
router.get("/", home.showHoa);

module.exports = router;
