const mongoose = require("mongoose");

module.exports = function () {
    mongoose.connect("mongodb://localhost:27017/qlbh", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
        console.log("connected successfully!");
    });
};
