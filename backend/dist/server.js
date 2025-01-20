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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the required modules
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_errors_1 = require("apollo-server-errors");
const schema_1 = require("./schema");
const QueryImpl_1 = require("./resolvers/QueryImpl");
const MutationImpl_1 = require("./resolvers/MutationImpl");
const CategoryImpl_1 = require("./resolvers/CategoryImpl");
const ProductImpl_1 = require("./resolvers/ProductImpl");
const productModelImpl_1 = __importDefault(require("./models/productModelImpl"));
const categoryModelImpl_1 = __importDefault(require("./models/categoryModelImpl"));
const reviewModelImpl_1 = __importDefault(require("./models/reviewModelImpl"));
const peopleModelImpl_1 = __importDefault(require("./models/peopleModelImpl"));
const mongoose_2 = require("mongoose");
const { sign, verify } = jsonwebtoken_1.default;
// Create an instance of Express
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield peopleModelImpl_1.default.findOne({ username });
    // throw an error the user wasn't found
    if (!user) {
        return res.status(400).json({ error: "Invalid login credentials" });
    }
    // check the user's password
    const valid = yield bcryptjs_1.default.compare(password, user.password);
    // throw an error if the password was incorrect
    if (!valid) {
        return res.status(400).json({ error: "Invalid login credentials" });
    }
    // create a token
    const token = sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    // return the token
    res.json({ token });
}));
// MIDDLE WARE to verify the user token.
app.use((req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Failed to authenticate token" });
        }
        // Add type assertion to ensure 'decoded' is not undefined
        req.body.userId = decoded.id;
        next();
    });
});
// handling the uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
(0, dotenv_1.config)({ path: "./config.env" });
const DB = (_a = process.env.DATABASE) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || "");
mongoose_1.default
    .connect(DB || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}) // Add the 'as mongoose.ConnectOptions' type assertion
    .then((con) => console.log("DB connection successful !"));
// Create an instance of ApolloServer
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: {
        Query: QueryImpl_1.Query,
        Mutation: MutationImpl_1.Mutation,
        Product: ProductImpl_1.Product,
        Category: CategoryImpl_1.Category,
    },
    introspection: true,
    context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
        const token = req.headers.authorization;
        let user = null;
        if (!token) {
            throw new apollo_server_errors_1.ApolloError("No token provided", "UNAUTHORIZED", {
                statusCode: 401,
            });
        }
        if (token) {
            try {
                const decoded = verify(token.split(" ")[1], process.env.JWT_SECRET); // Assert the type of 'decoded' to 'JwtPayload'
                user = yield peopleModelImpl_1.default.findById(decoded.id);
                if (!user) {
                    throw new apollo_server_errors_1.ApolloError("Invalid Token!!", "UNAUTHORIZED", {
                        statusCode: 401,
                    });
                }
            }
            catch (err) {
                console.log("error", err);
                throw new apollo_server_errors_1.ApolloError("Invalid Token!!", "UNAUTHORIZED", {
                    statusCode: 401,
                });
            }
        }
        return {
            ProductModel: productModelImpl_1.default,
            CategoryModel: categoryModelImpl_1.default,
            ReviewModel: reviewModelImpl_1.default,
            PeopleModel: peopleModelImpl_1.default,
            user,
        };
    }),
});
server.start().then(() => {
    console.log("Apollo server started...");
    server.applyMiddleware({ app });
    const port = process.env.PORT || 2000;
    // starting the server
    app.listen(port, () => {
        console.log(`App running at port: ${port}...`);
    });
});
//Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.stop().then(() => {
        mongoose_2.connection.close().then(() => {
            process.exit(1);
        });
    });
});
