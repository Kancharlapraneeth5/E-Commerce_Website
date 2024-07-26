// Importing the required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./schema");
const { Query } = require("./resolvers/Query");
const { Mutation } = require("./resolvers/Mutation");
const { Category } = require("./resolvers/Category");
const { Product } = require("./resolvers/Product");
const { db } = require("./db");

// Create an instance of Express
const app = express();

// handling the uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
  context: {
    db,
  },
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

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.stop().then(() => {
    mongoose.connection.close(() => {
      process.exit(1);
    });
  });
});
