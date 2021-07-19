//
var banghoa = require("../models/hoamodel1");

module.exports.select = async function (ml) {
    var dshoa = await banghoa.select({ maloai: ml });
    var kq = "<table width='100%' align='center' >";
    for (i = 0; i < dshoa.length; i++) {
        if (i % 3 == 0) kq = kq + "<tr>";
        kq =
            kq +
            "<td><a href='/detail/" +
            dshoa[i].mahoa +
            "'><img src='/images/" +
            dshoa[i].hinh +
            "' style='width:150px'></a><br>Tên hoa :" +
            dshoa[i].tenhoa +
            "<a href='/muahoa/" +
            dshoa[i].mahoa +
            "'><img src='/images/gio_hang.jpg'></a><br>Giá bán :" +
            dshoa[i].giaban +
            "</td>";
        if ((i + 1) % 3 == 0) kq = kq + "</tr>";
    }
    kq = kq + "</table";
    return kq;
};
module.exports.selectDetail = async function (mh) {
    var dshoa = await banghoa.select({ mahoa: mh });
    var kq = "<table width='100%' align='center' >";
    for (i = 0; i < dshoa.length; i++) {
        kq = kq + "<tr>";
        kq =
            kq +
            "<td><img src='/images/" +
            dshoa[i].hinh +
            "'></td><td>Tên hoa :" +
            dshoa[i].tenhoa +
            "<br>Giá bán :" +
            dshoa[i].giaban +
            "<br>Mô Tả :" +
            dshoa[i].mota +
            "<br><a href='/" +
            dshoa[i].maloai +
            "'>Về Trang Chủ</a></td>";
        kq = kq + "</tr>";
        break;
    }

    kq = kq + "</table";
    return kq;
};
module.exports.search = async function (ten) {
    var dshoa = await banghoa.select({
        $or: [{ tenhoa: new RegExp(ten, "i") }, { mota: new RegExp(ten, "i") }],
    });
    var kq = "<table width='100%' align='center' >";
    for (i = 0; i < dshoa.length; i++) {
        kq = kq + "<tr>";
        kq =
            kq +
            "<td><img src='/images/" +
            dshoa[i].hinh +
            "'></td><td>Tên hoa :" +
            dshoa[i].tenhoa +
            "<br>Giá bán :" +
            dshoa[i].dongia +
            "<br>Mô Tả :" +
            dshoa[i].mota +
            "<br><a href='/" +
            dshoa[i].maloai +
            "'>Về Trang Chủ</a></td>";

        kq = kq + "</tr>";
        break;
    }

    kq = kq + "</table";
    return kq;
};
module.exports.selectByCode = async function (mahoa) {
    var dshoa = await banghoa.select({ mahoa: mahoa });
    if (dshoa.length > 0) return dshoa[0];
    return "";
};

module.exports.themhoa = async function (newhoa) {
    var hoa = await banghoa.insert(newhoa);
    return hoa;
};
