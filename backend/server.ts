// Importing the required modules
import express from "express";
// import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { ApolloServer } from "apollo-server-express";
import { ApolloError } from "apollo-server-errors";
import { typeDefs } from "./schema";
import { Query } from "./resolvers/QueryImpl";
import { Mutation } from "./resolvers/MutationImpl";
import { Category } from "./resolvers/CategoryImpl";
import { Product } from "./resolvers/ProductImpl";
import { PrismaClient } from "@prisma/client";
import { authRouter } from "./auth/authController";
import razorpayRouter from "./auth/razorpayController";

// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || "development";
config({ path: `.env.${environment}` });

const { verify } = jwt;

// Create an instance of Express
const app = express();

// Get allowed origins from environment or use defaults for local and production
const allowedOrigins = [
  "http://localhost:3000", // Local development
  process.env.FRONTEND_URL, // Optional environment variable for flexibility
].filter(Boolean); // Filter out undefined/null values

// CORS middleware FIRST, with configurable origins and credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Use JSON body parser
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/payment/razorpay", razorpayRouter);

// handling the uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

config({ path: "./config.env" });

const prisma = new PrismaClient();

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
    const publicOperations = ["AddNewUser"];
    console.log("operationName", operationName);
    if (publicOperations.includes(operationName)) {
      return {
        prisma,
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
        ) as JwtPayload;
        user = await prisma.people.findUnique({ where: { id: decoded.id } });
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
      prisma,
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
    path: "/graphql",
  });

  app.use((_req, res, next) => {
    res.status(404).json({ error: "Endpoint not found" });
    next();
  });

  const port = Number(process.env.PORT) || 5000; // Render provides PORT, fallback to 5000
  const nodeEnv = process.env.NODE_ENV || "development";
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

  // starting the server
  app.listen(port, host, () => {
    console.log(`🚀 App running in ${nodeEnv} mode at ${host}:${port}...`);
    console.log(
      `📡 GraphQL endpoint: http://${host}:${port}${server.graphqlPath}`
    );
    console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(", ")}`);
  });
});



//Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.stop().then(() => {
    prisma.$disconnect().then(() => {
      process.exit(1);
    });
  });
});