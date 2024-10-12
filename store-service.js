const fs = require("fs");
const path = require("path");
let items = [];
let categories = [];

function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      const itemsData = fs.readFileSync(
        path.join(__dirname, "data", "items.json"),
        "utf8"
      );

      items = JSON.parse(itemsData);
      console.log(items);

      const CategoriesData = fs.readFileSync(
        path.join(__dirname, "data", "categories.json"),
        "utf8"
      );
      categories = JSON.parse(CategoriesData);

      resolve();
    } catch (error) {
      reject("unable to read file");
    }
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No results found");
    } else {
      resolve(items);
    }
  });
}

function getPublishedItems() {
  return new Pormise((resolve, reject) => {
    const publish = items.filter((item) => item.published === true);

    if (publish.length > 0) {
      resolve(publish);
    } else {
      reject("no results returned");
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("no results returned");
    } else {
      resolve(categories);
    }
  });
}
initialize();
module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
};
