const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });
const { Schema } = mongoose;

const itemsSchema = new Schema({
    name: String
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: "Feed the cat"
});

const item2 = new Item({
    name: "Shave the parrot"
});

const item3 = new Item({
    name: "Cook the dog"
});


const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);



var items = [];



// mongoose.deleteModel("Item"); 

// if (items.length === 0) {
//     Item.insertMany(defaultItems, function(err) {
//         if (err) {
//             console.log(err);
//         }
//     });
// }


app.use(express.static("public"));
// var items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');



app.get("/", function(req, res) {

    // let day = date.getDate();
    var lastItem = items[items.length - 1];

    Item.find({}, function(err, foundItems) {
        // console.log(foundItems);
        items = foundItems;
        res.render("list", { listTitle: "Today", newListItems: foundItems });

    });



});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({ name: itemName });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);

        });

    }
});

app.post("/delete", function(req, res) {

            const checkedItemId = req.body.checkbox;
            const listName = req.body.listName;

            if (listName === "Today") {
                Item.findByIdAndRemove(checkedItemId, function(err) {
                    if (err) {
                        console.log(err);
                    }
                })
                res.redirect("/");
            } else {
                List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function(err, foundList);
                    if (!err) {
                        res.redirect("");
                    }
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

        app.get("/:customListName", function(req, res) {
            const customListName = req.params.customListName;


            List.findOne({ name: customListName }, function(err, foundList) {
                if (!err) {
                    if (!foundList) {
                        // console.log("Doesn't exist");
                        const list = new List({
                            name: customListName,
                            items: defaultItems
                        });

                        list.save();
                        res.redirect("/" + customListName);
                    } else {
                        // console.log(customListName + " exists");

                        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });

                    }
                }

            });

        }); app.listen(3000, function() {
            console.log("Server started on port 3000");
        })