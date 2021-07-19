var express = require("express");
var router = express.Router();
var home = require("../controllers/homeController");

/* GET home page. */
router.get("/", home.index);
router.get("/:mahoa", home.showHoa);
router.post("/timkiem", home.timKiem);
module.exports = router;
