var hoaModel = require("../models/hoamodel");
var loaihoaModel = require("../models/loaihoamodel");

class homeController {
    index(req, res, next) {
        hoaModel.find({}, function (err, docs) {
            if (err) next(createError(404));
            else {
                res.render("home/homeview", {
                    layout: "home/homelayout",
                    title: "Home",
                    hoas: docs,
                });
                next("route");
            }
        });
    }
    showHoa(req, res, next) {
        hoaModel.find({ maloai: req.params.mahoa }, function (err, docs) {
            if (err) next(createError(404));
            else {
                res.render("home/homeview", {
                    layout: "home/homelayout",
                    title: "Home",
                    hoas: docs,
                    maloai: req.params.mahoa,
                });
                next("route");
            }
        });
    }
    timKiem(req, res, next) {
        hoaModel.find({}, function (err, docs) {
            function removeAccents(str) {
                return str
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/đ/g, "d")
                    .replace(/Đ/g, "D");
            }
            if (err) next(createError(404));
            else {
                var result = docs.filter(
                    (hoa) =>
                        removeAccents(hoa.tenhoa)
                            .toLowerCase()
                            .search(
                                removeAccents(req.body.key).toLowerCase()
                            ) !== -1 ||
                        removeAccents(hoa.mota)
                            .toLowerCase()
                            .search(
                                removeAccents(req.body.key).toLowerCase()
                            ) !== -1
                );
                // res.json(req.body.key);
                res.render("search/searchview", {
                    layout: "search/searchlayout",
                    title: "search",
                    hoas: result,
                    key: req.body.key,
                });
                next("route");
            }
        });
    }
}

module.exports = new homeController();
