// Importing the required modules
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { ApolloServer } from "apollo-server-express";
import { ApolloError } from "apollo-server-errors";
import { typeDefs } from "./schema";
import { Query } from "./resolvers/QueryImpl";
import { Mutation } from "./resolvers/MutationImpl";
import { Category } from "./resolvers/CategoryImpl";
import { Product } from "./resolvers/ProductImpl";
import ProductModel from "./models/productModelImpl";
import CategoryModel from "./models/categoryModelImpl";
import ReviewModel from "./models/reviewModelImpl";
import PeopleModel from "./models/peopleModelImpl";
import { connection } from "mongoose";

const { sign, verify } = jwt;

// Create an instance of Express
const app = express();

// Get allowed origins from environment or use defaults for local and production
const allowedOrigins = [
  "http://localhost:3000",                // Local development
  "https://your-netlify-app.netlify.app", // Replace with your actual Netlify domain
  process.env.FRONTEND_URL               // Optional environment variable for flexibility
].filter(Boolean); // Filter out undefined/null values

// CORS middleware FIRST, with configurable origins and credentials
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Handle preflight requests for all routes
app.options("*", cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
// Load env variables
config({ path: "./config.env" });

// Use JSON body parser
app.use(express.json());

app.post("/auth", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await PeopleModel.findOne({ username });

  // throw an error the user wasn't found
  if (!user) {
    return res.status(400).json({ error: "Invalid login credentials" });
  }

  // check the user's password
  const valid = await bcrypt.compare(password, user.password);

  // throw an error if the password was incorrect
  if (!valid) {
    return res.status(400).json({ error: "Invalid login credentials" });
  }

  // create a token
  const token = sign({ id: user.id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "1h",
  });

  // return the token
  res.json({ token });
});

// MIDDLE WARE to verify the user token.
app.use((req: Request, res: Response, next: NextFunction) => {
  const operationName = req.body.operationName;

  // List of public operations that do not require authentication
  const publicOperations = ["AddNewUser"];

  if (publicOperations.includes(operationName)) {
    // Skip authentication for public operations
    console.log("I am in correct block!!");
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("I am in wrong block!!");
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }

    // Add type assertion to ensure 'decoded' is not undefined
    req.body.userId = (decoded as { id: string }).id;
    next();
  });
});

// handling the uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

config({ path: "./config.env" });

const DB = process.env.DATABASE?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

mongoose
  .connect(DB || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions) // Add the 'as mongoose.ConnectOptions' type assertion
  .then((con) => console.log("DB connection successful !"));

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Product,
    Category,
  },
  introspection: true,
  context: async ({ req }) => {
    const operationName = req.body.operationName;

    // List of public operations that do not require authentication
    const publicOperations = ["AddNewUser"];

    console.log("operationName", operationName);

    if (publicOperations.includes(operationName)) {
      // Skip authentication for public operations
      return {
        ProductModel,
        CategoryModel,
        ReviewModel,
        PeopleModel,
        user: null,
      };
    }

    const token = req.headers.authorization;
    let user = null;

    if (!token) {
      throw new ApolloError("No token provided", "UNAUTHORIZED", {
        statusCode: 401,
      });
    }

    if (token) {
      try {
        const decoded = verify(
          token.split(" ")[1],
          process.env.JWT_SECRET as Secret
        ) as JwtPayload; // Assert the type of 'decoded' to 'JwtPayload'
        user = await PeopleModel.findById(decoded.id);

        if (!user) {
          throw new ApolloError("Invalid Token!!", "UNAUTHORIZED", {
            statusCode: 401,
          });
        }
      } catch (err) {
        console.log("error", err);
        throw new ApolloError("Invalid Token!!", "UNAUTHORIZED", {
          statusCode: 401,
        });
      }
    }
    return {
      ProductModel,
      CategoryModel,
      ReviewModel,
      PeopleModel,
      user,
    };
  },
});

server.start().then(() => {
  console.log("Apollo server started...");
  // Apply middleware with CORS disabled (using Express CORS middleware instead)
  server.applyMiddleware({ 
    app, 
    cors: false,
    // Log Apollo server path
    path: '/graphql'
  });
  
  const port = process.env.PORT || 2000;
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // starting the server
  app.listen(port, () => {
    console.log(`App running in ${nodeEnv} mode at port: ${port}...`);
    console.log(`GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`);
    const allowedOrigins = [
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ].filter(Boolean);
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  });
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.stop().then(() => {
    connection.close().then(() => {
      process.exit(1);
    });
  });
});
function next(): object | PromiseLike<object> {
  throw new Error("Function not implemented.");
}
