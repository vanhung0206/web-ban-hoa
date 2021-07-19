var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var loaihoa = new Schema({
    maloai: String,
    tenloai: String,
});

module.exports = mongoose.model("loaihoas", loaihoa);
