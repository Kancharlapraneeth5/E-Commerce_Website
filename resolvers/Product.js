// MODIFIED....
const mongoose = require("mongoose");

const category = require("../models/categoriesModel");
const review = require("../models/reviewsModel");

exports.Product = {
  category: async (parent, args) => {
    const categoryId = parent.categoryId;
    const Category = await category.findById(categoryId);
    return Category;
  },

  reviews: async ({ id }, args) => {
    const reviews = await review.find({ productId: id });
    return reviews;
    // below is the previous one.
    // return db.reviews.filter((review) => review.productId === id);
  },
};
