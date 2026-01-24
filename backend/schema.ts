import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    products(filter: ProductFilterInput): [Product!]!
    product(productId: Int!): Product
    productByName(productName: String!): Product
    categories: [Category!]!
    category(categoryId: Int!): Category
    categoryByName(categoryName: String!): Category
    reviews: [Review!]!
    reviewsByProductId(productId: Int!): [Review!]!
    review(reviewId: Int!): Review
    productsByReviewRating(
      minRating: Int!
      maxRating: Int!
      categoryId: Int!
    ): [Product]
    productsByCategory(categoryId: Int!): [Product]
    getCart(userId: Int!): Cart
  }

  type Mutation {
    addNewCategory(input: AddCategoryInput!): Category!
    addNewProduct(input: AddProductInput!): Product!
    addNewProducts(input: AddProductsInput!): [Product!]!
    addNewReview(input: AddReviewInput!): Review!
    addNewUser(input: AddUserInput!): User!
    deleteCategory(categoryID: Int!): Boolean!
    deleteProduct(productID: Int!): Boolean!
    deleteReview(reviewID: Int!): Boolean!
    updateCategory(categoryID: Int!, input: UpdateCategoryInput!): Category
    addToCart(input: AddToCartInput!): Cart!
    removeFromCart(input: removeFromCartInput!): Boolean!
    updateCart(input: updateCartInput!): Cart!
  }
  type Product {
    id: Int!
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
    id: Int!
    name: String!
    products(filter: ProductFilterInput): [Product!]!
  }

  type Review {
    id: Int!
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productId: Int!
  }

  type User {
    id: Int!
    username: String!
    password: String!
    role: String!
  }

  type Cart {
    id: Int!
    userId: Int!
    items: [CartItem!]!
  }

  type CartItem {
    productId: Int!
    quantity: Int!
  }

  input ProductFilterInput {
    onSale: Boolean
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
    categoryId: Int!
  }

  input AddProductsInput {
    products: [AddProductInput!]!
  }

  input AddReviewInput {
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productId: Int!
  }

  input AddUserInput {
    username: String!
    password: String!
    role: String!
  }

  input CartItemInput {
    productId: Int!
    quantity: Int!
  }

  input AddToCartInput {
    userId: Int!
    items: [CartItemInput!]!
  }

  input removeFromCartInput {
    userId: Int!
    productId: Int!
  }

  input updateCartInput {
    userId: Int!
    productId: Int!
    quantity: Int!
  }
`;
