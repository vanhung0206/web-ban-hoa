var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    tendn: String,
    matkhau: String,
    hoten: String,
    diachi: String,
    dienthoai: String,
    email: String,
});
userTablekhachhang = mongoose.model("khachhang", userSchema);
module.exports.select = async function (query) {
    console.log(query);
    var bangkhachhang = await userTablekhachhang.find(query);
    return bangkhachhang;
};
module.exports.get = async function (tendn) {
    var bangkhachhang = await userTablekhachhang.findOne({ tendn: tendn });
    console.log("bang khach hang" + bangkhachhang);
    return bangkhachhang;
};
module.exports.update = async function (user) {
    var kiemtramatkhau = await userTablekhachhang.findOne({
        tendn: user.tendn_cu,
        matkhau: user.mat_khau_cu,
    });
    if (kiemtramatkhau) {
        var bangkhachhang = await userTablekhachhang.updateOne({
            tendn: user.ten_dn,
            matkhau: user.mat_khau_moi,
            hoten: user.ho_ten,
            diachi: user.dia_chi,
            dienthoai: user.so_dt,
            email: user.email,
        });
        return "Cập nhật thành công";
    }
    return "Mật khẩu nhập không đúng";
};
module.exports.insert = async function (newkhachhang) {
    const kh = new userTablekhachhang({
        tendn: newkhachhang.tendn,
        matkhau: newkhachhang.matkhau,
        hoten: newkhachhang.hoten,
        diachi: newkhachhang.diachi,
        dienthoai: newkhachhang.dienthoai,
        email: newkhachhang.email,
    });
    var userData = await kh.save();
    return userData;
};
