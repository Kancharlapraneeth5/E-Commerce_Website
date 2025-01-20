import * as fs from "fs";
import mongoose, { Model, Document } from "mongoose";
import * as dotenv from "dotenv";
import Category from "../models/categoryModelImpl";
import Product from "../models/productModelImpl";
import Review from "../models/reviewModelImpl";
import People from "../models/peopleModelImpl";

dotenv.config({ path: "./../config.env" });

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then((con) => console.log("DB connection successful !"));

interface DataMap {
  [key: string]: {
    data: any;
    model: Model<any>;
  };
}

const dataMap: DataMap = {
  "Categories.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/Categories.json`, "utf-8")),
    model: Category,
  },
  "Products.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/Products.json`, "utf-8")),
    model: Product,
  },
  "Reviews.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/Reviews.json`, "utf-8")),
    model: Review,
  },
  "People.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/People.json`, "utf-8")),
    model: People,
  },
};

const importData = async (model: Model<Document, {}>, data: any) => {
  try {
    await model.create(data);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async (model: Model<Document, {}>) => {
  try {
    await model.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (dataMap[process.argv[2]]) {
  if (process.argv[3] === "--import") {
    importData(dataMap[process.argv[2]].model, dataMap[process.argv[2]].data);
  } else if (process.argv[3] === "--delete") {
    deleteData(dataMap[process.argv[2]].model);
  }
}
