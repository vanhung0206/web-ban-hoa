var mongoose = require("mongoose");

var hoa = new mongoose.Schema({
    mahoa: String,
    maloai: String,
    tenhoa: String,
    giaban: String,
    hinh: String,
    mota: String,
});

module.exports = mongoose.model("hoas", hoa);
