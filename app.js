var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
var expressLayouts = require("express-ejs-layouts");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var khachhangController = require("./controllers/khachhangController");
var hoaController = require("./controllers/hoaController");
var hoaModel = require("./models/hoamodel1");
var hoaModel1 = require("./models/hoamodel");
var donhang = require("./controllers/donhangcontroller");
var session = require("express-session");
var nodemailer = require("nodemailer");
const { json } = require("express");
var app = express();
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "1234567abc",
        cookie: { maxAge: 60000 },
    })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.post("/dangnhap", function (req, res, next) {
    var thongtin = req.body;
    var tendn = thongtin.ten_dn;
    var matkhau = thongtin.mat_khau;
    dangnhap(req, res, next, tendn, matkhau);
});

function HienThiChiTietGioHang(req, res) {
    var giohang = req.session.giohang;
    var ttctgh = "";
    var hoten = "";
    var diachi = "";
    var dienthoai = "";
    var email = "";
    if (giohang != undefined) {
        ttctgh =
            "<table width='80%' cellpadding = '2' cellspacing ='0' border='1'";
        ttctgh =
            ttctgh +
            "<tr><td width = '10%'>STT</td><td width='10%'>Mã hoa</td><td width='30%'>Tên hoa</td><td width='10%'>Số lượng</td><td width='15%'>Đơn giá</td><td>Tổng tiền</td><td>Xóa</td></tr>";
        var stt = 1;
        for (i = 0; i < giohang.length; i++) {
            ttctgh =
                ttctgh +
                "<tr><td>" +
                stt +
                "</td><td>" +
                giohang[i].mahoa +
                "</td><td>" +
                giohang[i].tenhoa +
                `</td><td><input class="inputAjax" type='text' value='` +
                giohang[i].soluong +
                "' name='txtsl" +
                giohang[i].mahoa +
                "'/></td><td>" +
                giohang[i].giaban +
                "</td><td>" +
                giohang[i].soluong * giohang[i].giaban +
                "</td><td><a href='#' onclick='Xoamahang(" +
                giohang[i].mahoa +
                ")'>Xóa</a></td></tr>";
            stt++;
        }
        ttctgh =
            ttctgh +
            "<tr> <td colspan='7' align='right'><button class='capnhatAjax' > Cập nhật</button></td></tr>";
        ttctgh = ttctgh + +"</table>";

        if (req.session.kh != "" && req.session.kh != undefined) {
            hoten = req.session.kh.hoten;
            diachi = req.session.kh.diachi;
            dienthoai = req.session.kh.dienthoai;
            email = req.session.kh.email;
        }
        console.log("test thu");
        res.render("carts/cartsview", {
            layout: "home/homelayout",
            title: "Home",
            ttctgh: ttctgh,
            hoten: hoten,
            diachi: diachi,
            dienthoai: dienthoai,
            email: email,
        });
    } else {
        res.json("giỏ hàng rỗng");
    }
}

app.get("/chitietgiohang", HienThiChiTietGioHang);

app.get("/xoadonhang/:mahoa", function (req, res) {
    var mahoa = req.params.mahoa;
    for (i = 0; i < req.session.giohang.length; i++)
        if (req.session.giohang[i].mahoa == mahoa) {
            req.session.giohang.splice(i, 1);
            break;
        }
    res.redirect("/chitietgiohang");
});

app.post("/capnhapgiohang", function (req, res) {
    var thongtin = req.body;
    for (i = 0; i < req.session.giohang.length; i++) {
        req.session.giohang[i].soluong =
            eval("thongtin.txtsl" + req.session.giohang[i].mahoa) * 1;
    }
    res.redirect("/chitietgiohang");
});

app.post("/xulydathang", async function (req, res) {
    var thongtin = req.body;
    hoten = thongtin.ho_ten;
    diachi = thongtin.dia_chi;
    dienthoai = thongtin.dien_thoai;
    email = thongtin.email;
    console.log(thongtin);
    var dh = {
        sodh: 1,
        hoten: hoten,
        diachi: diachi,
        dienthoai: dienthoai,
        email: email,
    };
    dh.dsmh = req.session.giohang;
    kq = donhang.insert(dh);
    giohang = req.session.giohang;

    //mail
    ttctgh = "<h1 align='center'>Thông tin đơn hàng</h1>";
    ttctgh = ttctgh + "<p>Họ tên: " + hoten + "</p>";
    ttctgh = ttctgh + "<p>Địa chỉ: " + diachi + "</p>";
    ttctgh = ttctgh + "<p>Điện thoại: " + dienthoai + "</p>";
    ttctgh = ttctgh + "<p>Email: " + email + "</p>";
    ttctgh =
        ttctgh +
        "<table width='80%' cellspacing='0' cellpadding='2' border='1'>";
    ttctgh =
        ttctgh +
        "<tr><td width = '10%'>STT</td><td width='10%'>Mã hoa</td><td width='30%'>Tên hoa</td><td width='10%'>Số lượng</td><td width='15%'>Đơn giá</td><td>Tổng tiền</td></tr>";
    var tongtien = 0;
    var stt = 1;
    for (i = 0; i < giohang.length; i++) {
        ttctgh =
            ttctgh +
            "<tr><td>" +
            stt +
            "</td><td>" +
            giohang[i].mahoa +
            "</td><td>" +
            giohang[i].tenhoa +
            "</td><td><input type='text' value='" +
            giohang[i].soluong +
            "' name='txtsl" +
            giohang[i].mahoa +
            "'/></td><td>" +
            giohang[i].giaban +
            "</td><td>" +
            giohang[i].soluong * giohang[i].giaban +
            "</td></tr>";
        stt++;
        tongtien = tongtien + giohang[i].soluong * giohang[i].giaban;
    }
    ttctgh =
        ttctgh +
        "<tr><td colspan = '7' align='right'>Tổng tiền: " +
        tongtien +
        "</td></tr></table>";
    ttctgh =
        ttctgh +
        "<p>Cảm ơn quý khách đã đạt hàng, đơn hàng sẽ chuyến đền quý khách trong thời gian sớm nhất";
    sendmail(email, "Đơn hàng shop hoa tươi", ttctgh);

    if (kq) req.session.giohang = null;
    res.redirect("/");
});

function sendmail(tomail, tieude, noidung) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "bocau.duathu.web@gmail.com",
            pass: "Vhung0206",
        },
    });
    var mailOptions = {
        from: "bocau.duathu.web@gmail.com",
        to: tomail,
        subject: tieude,
        html: noidung,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

app.post("/dangky", async function (req, res, next) {
    var thongtin = req.body;
    console.log(thongtin);
    var ten_dn = thongtin.ten_dn;
    var mat_khau = thongtin.mat_khau;
    var ho_ten = thongtin.ho_ten;
    var email = thongtin.email;
    var dia_chi = thongtin.dia_chi;
    var dien_thoai = thongtin.so_dt;
    var reslut = await khachhangController.insert({
        tendn: ten_dn,
        matkhau: mat_khau,
        hoten: ho_ten,
        diachi: dia_chi,
        dienthoai: dien_thoai,
        email: email,
    });
    res.json(reslut);

    next("route");
});

app.get("/details/:id", (req, res, next) => {
    var id = req.params.id;
    hoaModel1.find({ mahoa: id }, function (err, docs) {
        if (err) next(createError(404));
        else {
            res.render("details/detailview", {
                layout: "home/homelayout",
                title: "Home",
                hoas: docs,
            });
            next("route");
        }
    });
});

app.get("/giohang/:id", async (req, res, next) => {
    var mahoa = req.params.id;
    hm = await hoaController.selectByCode(mahoa);
    console.log(hm);
    if (req.session.giohang == undefined) {
        req.session.giohang = [];
        var h = {
            mahoa: mahoa,
            tenhoa: hm.tenhoa,
            giaban: hm.giaban,
            hinh: hm.hinh,
            soluong: 1,
            thanhtien: hm.giaban,
        };
        req.session.giohang[0] = h;
    } else {
        var co = 0;
        for (i = 0; i < req.session.giohang.length; i++)
            if (req.session.giohang[i].mahoa == mahoa) {
                console.log(mahoa);
                req.session.giohang[i].soluong++;
                req.session.giohang[i].thanhtien =
                    req.session.giohang[i].soluong *
                    req.session.giohang[i].giaban;
                co = 1;
                break;
            }
        if (co == 0) {
            var h = {
                mahoa: mahoa,
                tenhoa: hm.tenhoa,
                giaban: hm.giaban,
                hinh: hm.hinh,
                soluong: 1,
                thanhtien: hm.giaban,
            };
            req.session.giohang[req.session.giohang.length] = h;
        }
    }
    var count = req.session.giohang.reduce(
        (acc, curr) => acc + curr.soluong,
        0
    );
    res.json(count);
});

app.use("/", indexRouter);

async function dangnhap(req, res, next, tendn, matkhau) {
    var kh = await khachhangController.login(tendn, matkhau);
    console.log(kh);
    hoaModel1.find({}, function (err, docs) {
        if (err) next(createError(404));
        else {
            res.json(kh);
            next("route");
        }
    });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
