const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");

app.use(express.static("public"));
var items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');



app.get("/", function(req, res) {

    let day = date.getDate();
    var lastItem = items[items.length - 1];
    res.render("list", { listTitle: day, newListItems: items });


});

app.post("/", function(req, res) {
    let item = req.body.newItem;


    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");

    } else {
        items.push(item);
        res.redirect("/");

    }

});

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;

    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req, res) {
    res.render("about");
});
app.listen(3000, function() {
    console.log("Server started on port 3000");
});