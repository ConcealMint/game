const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "ejs")


app.use(express.static("./public"));



app.get("/", (req, res) => {
    res.render("practice", { "age": 12 });
});

app.get("/error", (req, res) => {
    throw Error("Something went wrong.");
})

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render("error", { error: err });
})


app.listen(6996, () => {
    console.log("The server is running on port 6996.");
});