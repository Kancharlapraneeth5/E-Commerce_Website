"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const categoryModelImpl_1 = __importDefault(require("../models/categoryModelImpl"));
const productModelImpl_1 = __importDefault(require("../models/productModelImpl"));
const reviewModelImpl_1 = __importDefault(require("../models/reviewModelImpl"));
const peopleModelImpl_1 = __importDefault(require("../models/peopleModelImpl"));
dotenv_1.default.config({ path: "./../config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then((con) => console.log("DB connection successful !"));
const dataMap = {
    "Categories.json": {
        data: JSON.parse(fs_1.default.readFileSync(`${__dirname}/Categories.json`, "utf-8")),
        model: categoryModelImpl_1.default,
    },
    "Products.json": {
        data: JSON.parse(fs_1.default.readFileSync(`${__dirname}/Products.json`, "utf-8")),
        model: productModelImpl_1.default,
    },
    "Reviews.json": {
        data: JSON.parse(fs_1.default.readFileSync(`${__dirname}/Reviews.json`, "utf-8")),
        model: reviewModelImpl_1.default,
    },
    "People.json": {
        data: JSON.parse(fs_1.default.readFileSync(`${__dirname}/People.json`, "utf-8")),
        model: peopleModelImpl_1.default,
    },
};
const importData = (model, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model.create(data);
        console.log("Data successfully loaded!");
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
});
const deleteData = (model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model.deleteMany();
        console.log("Data successfully deleted!");
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
});
if (dataMap[process.argv[2]]) {
    if (process.argv[3] === "--import") {
        importData(dataMap[process.argv[2]].model, dataMap[process.argv[2]].data);
    }
    else if (process.argv[3] === "--delete") {
        deleteData(dataMap[process.argv[2]].model);
    }
}
