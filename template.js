const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const https = require("https");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, resp){
  resp.sendFile(__dirname + "/index.html");
});


app.listen(3000);
