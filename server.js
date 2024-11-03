/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or
distributed to other students.
Name: Min ThuKha
Student ID: 164144222
Date: 12th October 2024
Vercel Web App URL: https://web322-app-zeta-liard.vercel.app/
GitHub Repository URL: https://github.com/Princeingh/WEB322-app.git
********************************************************************************/

const express = require("express");
const path = require("path");
const storeService = require("./store-service");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "doqog4kps",
  api_key: "346318215228989",
  api_secret: "b22URZRRfG2MY_KkBVK7Y-YEnaU",
  secure: true,
});

const upload = multer();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // for parsing form data

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

    app.get("/items/add", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "addItem.html"));
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

    app.post("/items/add", upload.single("featureImage"), (req, res) => {
      if (req.file) {
        let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream((error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            });
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };
        async function upload(req) {
          let result = await streamUpload(req);
          console.log(result);
          return result;
        }
        upload(req).then((uploaded) => {
          processItem(uploaded.url);
        });
      } else {
        processItem("");
      }

      function processItem(imageUrl) {
        req.body.featureImage = imageUrl;
        // TODO: Process the req.body and add it as a new Item before redirecting to /items

        storeService
          .addItem(req.body)
          .then((newItem) => {
            res.redirect("/items");
          })
          .catch((error) => {
            console.error("Error adding item:", error);
            res.status(500).send("Error adding item");
          });
      }
    });

    // Get Items by Category
    app.get("/items/category/:category", async (req, res) => {
      const category = req.params.category;
      try {
        const items = await storeService.getItemsByCategory(category);
        res.json(items);
      } catch (error) {
        console.error(error);
        res.status(404).send("No items found in this category");
      }
    });

    // Get Items by Minimum Date
    app.get("/items/min-date", async (req, res) => {
      const minDateStr = req.query.date; // Expecting date as a query parameter
      if (!minDateStr) {
        return res.status(400).send("Minimum date is required");
      }
      try {
        const items = await storeService.getItemsByMinDate(minDateStr);
        res.json(items);
      } catch (error) {
        console.error(error);
        res.status(404).send("No items found after this date");
      }
    });

    // Get Item by ID
    app.get("/items/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10); // Convert the ID from string to number
      try {
        const item = await storeService.getItemById(id);
        res.json(item);
      } catch (error) {
        console.error(error);
        res.status(404).send("No item found with this ID");
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
