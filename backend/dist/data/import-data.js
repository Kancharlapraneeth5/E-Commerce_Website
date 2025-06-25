"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const categoryModelImpl_1 = __importDefault(require("../models/categoryModelImpl"));
const productModelImpl_1 = __importDefault(require("../models/productModelImpl"));
const reviewModelImpl_1 = __importDefault(require("../models/reviewModelImpl"));
const peopleModelImpl_1 = __importDefault(require("../models/peopleModelImpl"));
dotenv.config({ path: "./../config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then((con) => console.log("DB connection successful !"));
const dataMap = {
    "Categories.json": {
        data: JSON.parse(fs.readFileSync(`${__dirname}/Categories.json`, "utf-8")),
        model: categoryModelImpl_1.default,
    },
    "Products.json": {
        data: JSON.parse(fs.readFileSync(`${__dirname}/Products.json`, "utf-8")),
        model: productModelImpl_1.default,
    },
    "Reviews.json": {
        data: JSON.parse(fs.readFileSync(`${__dirname}/Reviews.json`, "utf-8")),
        model: reviewModelImpl_1.default,
    },
    "People.json": {
        data: JSON.parse(fs.readFileSync(`${__dirname}/People.json`, "utf-8")),
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
