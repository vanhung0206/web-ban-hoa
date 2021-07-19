var bangkhachhang = require("../models/khachhangmodel");
module.exports.login = async function (tendn, matkhau) {
    var dskh = await bangkhachhang.select({ tendn: tendn, matkhau: matkhau });
    if (dskh.length > 0) return dskh[0];
    return "";
};
module.exports.get = async function (tendn) {
    var kh = await bangkhachhang.get(tendn);
    console.log(kh);
    return kh;
};
module.exports.update = async function (user) {
    var thongbao = await bangkhachhang.update(user);
    return thongbao;
};
module.exports.insert = async function (newKhachhang) {
    console.log(newKhachhang);
    createdkh = await bangkhachhang.insert(newKhachhang);
    return createdkh;
};
