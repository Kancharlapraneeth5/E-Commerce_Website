"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
  type Query {
    products(filter: ProductFilterInput): [Product!]!
    product(productId: ID!): Product
    productByName(productName: String!): Product
    categories: [Category!]!
    category(categoryId: ID!): Category
    categoryByName(categoryName: String!): Category
    reviews: [Review!]!
    review(reviewId: ID!): Review
    productsByReviewRating(rating: Int!): [Product]
  }

  type Mutation {
    addNewCategory(input: AddCategoryInput!): Category!
    addNewProduct(input: AddProductInput!): Product!
    addNewProducts(input: [AddProductInput!]!): [Product!]!
    addNewReview(input: AddReviewInput!): Review!
    addNewUser(input: AddUserInput!): User!
    deleteCategory(id: ID!): Boolean!
    deleteProduct(id: ID!): Boolean!
    deleteReview(id: ID!): Boolean!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category
  }
  type Product {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    image: String!
    price: Float!
    onSale: Boolean!
    category: Category
    reviews: [Review!]!
  }

  type Category {
    id: ID!
    name: String!
    products(filter: ProductFilterInput): [Product!]!
  }

  type Review {
    id: ID!
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productId: String
  }

  type User {
    id: ID!
    username: String!
    password: String!
    role: String!
  }

  input ProductFilterInput {
    onSale: Boolean
  }

  input ReviewFilterInput {
    rating: Int
  }

  input AddCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String!
  }

  input AddProductInput {
    name: String!
    description: String!
    quantity: Int!
    image: String!
    price: Float!
    onSale: Boolean!
    categoryId: String!
  }

  input AddReviewInput {
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productId: String!
  }

  input AddUserInput {
    username: String!
    password: String!
    role: String!
  }
`;
