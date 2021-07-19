var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var hoa = new Schema({
    mahoa: String,
    maloai: String,
    tenhoa: String,
    giaban: String,
    hinh: String,
    mota: String,
});
userHoa = mongoose.model("hoa", hoa);
module.exports.select = async function (query) {
    var userData = await userHoa.find(query);
    return userData;
};
module.exports.insert = async function (newhoa) {
    const hoa = new userHoa({
        mahoa: newhoa.mahoa,
        maloai: newhoa.maloai,
        tenhoa: newhoa.tenhoa,
        giaban: newhoa.giaban,
        hinh: newhoa.hinh,
        mota: newhoa.mota,
    });
    var userData = await hoa.save();
    return userData;
};
