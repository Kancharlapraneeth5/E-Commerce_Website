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
const cors_1 = __importDefault(require("cors"));
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
// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
(0, dotenv_1.config)({ path: `.env.${environment}` });
const { sign, verify } = jsonwebtoken_1.default;
// Create an instance of Express
const app = (0, express_1.default)();
// Get allowed origins from environment or use defaults for local and production
const allowedOrigins = [
    "http://localhost:3000", // Local development
    process.env.FRONTEND_URL, // Optional environment variable for flexibility
].filter(Boolean); // Filter out undefined/null values
// CORS middleware FIRST, with configurable origins and credentials
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 ||
            process.env.NODE_ENV !== "production") {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Handle preflight requests for all routes
app.options("*", (0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 ||
            process.env.NODE_ENV !== "production") {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Use JSON body parser
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
    const operationName = req.body.operationName;
    // List of public operations that do not require authentication
    const publicOperations = ["AddNewUser"];
    if (publicOperations.includes(operationName)) {
        // Skip authentication for public operations
        console.log("I am in correct block!!");
        return next();
    }
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        console.log("I am in wrong block!!");
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
        const operationName = req.body.operationName;
        // List of public operations that do not require authentication
        const publicOperations = ["AddNewUser"];
        console.log("operationName", operationName);
        if (publicOperations.includes(operationName)) {
            // Skip authentication for public operations
            return {
                ProductModel: productModelImpl_1.default,
                CategoryModel: categoryModelImpl_1.default,
                ReviewModel: reviewModelImpl_1.default,
                PeopleModel: peopleModelImpl_1.default,
                user: null,
            };
        }
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
    // Apply middleware with CORS disabled (using Express CORS middleware instead)
    server.applyMiddleware({
        app,
        cors: false,
        // Log Apollo server path
        path: "/graphql",
    });
    const port = Number(process.env.PORT) || 5000; // Render provides PORT, fallback to 5000
    const nodeEnv = process.env.NODE_ENV || "development";
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    // starting the server
    app.listen(port, host, () => {
        console.log(`🚀 App running in ${nodeEnv} mode at ${host}:${port}...`);
        console.log(`📡 GraphQL endpoint: http://${host}:${port}${server.graphqlPath}`);
        console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(", ")}`);
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
function next() {
    throw new Error("Function not implemented.");
}
