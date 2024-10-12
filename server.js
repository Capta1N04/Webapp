const express = require("express");
const path = require("path");
const app = express();
const HTTP_Port = process.env.PORT || 8080;
const server_service = require("./store-service");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("This is Main page");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.listen(HTTP_Port, () => {
  console.log(`Server Listening on port ${HTTP_Port}`);
});
