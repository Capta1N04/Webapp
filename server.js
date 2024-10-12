const express = require("express");
const path = require("path");
const storeService = require("./store-service");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

storeService
  .initialize()
  .then(() => {
    console.log("Data initialized successfully");

    app.get("/shop", async (req, res) => {
      try {
        const items = await storeService.getAllItems();
        res.json(items);
      } catch (error) {
        console.error(error);
        res.status(404).send("No items found");
      }
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views/about.html"));
    });

    app.get("/items", async (req, res) => {
      try {
        const items = await storeService.getAllItems();
        res.json(items);
      } catch (error) {
        console.error(error);
        res.status(404).send("No items found");
      }
    });

    app.get("/categories", async (req, res) => {
      try {
        const categories = await storeService.getCategories();
        res.json(categories);
      } catch (error) {
        console.error(error);
        res.status(404).send("No categories found");
      }
    });

    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, "/views/404_error.html"));
    });

    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing data:", err);
  });
