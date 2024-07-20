// this is the main page for our application......

// all the required imports...
const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./schema");
const { Query } = require("./resolvers/Query");
const { Mutation } = require("./resolvers/Mutation");
const { Category } = require("./resolvers/Category");
const { Product } = require("./resolvers/Product");
const { db } = require("./db");

// from the below we are passing the required 1) typeDefs (schema) 2) resolvers 3) context (database)
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

// the below statement will start the server at localhost: 4000
server.listen().then(({ url }) => {
  console.log("Server is running at " + url);
});
