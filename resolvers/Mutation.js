// MODIFIED....

const category = require("../models/categoriesModel");
const product = require("../models/productsModel");
const review = require("../models/reviewsModel");

const { v4: uuid } = require("uuid");

exports.Mutation = {
  addNewCategory: (parent, { input }) => {
    const { name } = input;
    const newCategory = {
      id: uuid(),
      name,
    };
    category.create(newCategory);
    return newCategory;
  },
  addNewProduct: (parent, { input }) => {
    const { name, image, price, onSale, quantity, categoryId, description } =
      input;
    const newProduct = {
      id: uuid(),
      name,
      image,
      price,
      onSale,
      quantity,
      categoryId,
      description,
    };

    product.create(newProduct);
    return newProduct;
  },

  addNewProducts: (parent, { input }) => {
    const newProducts = input.map((productInput) => {
      const { name, image, price, onSale, quantity, categoryId, description } =
        productInput;
      const newProduct = {
        id: uuid(),
        name,
        image,
        price,
        onSale,
        quantity,
        categoryId,
        description,
      };

      return newProduct;
    });

    product.create(newProducts);
    return newProducts;
  },

  addNewReview: (parent, { input }) => {
    const { date, title, comment, rating, productID } = input;
    const newReview = {
      id: uuid(),
      date,
      title,
      comment,
      rating,
      productID,
    };

    review.create(newReview);
    return newReview;
  },

  deleteCategory: async (parent, { id }) => {
    await category.findByIdAndDelete(id);
    await product.updateMany(
      { categoryId: id },
      { $set: { categoryId: null } }
    );
    return true;
  },
  deleteProduct: async (parent, { id }) => {
    await product.findByIdAndDelete(id);
    await review.deleteMany({ productId: id });
    return true;
  },
  deleteReview: async (parent, { id }) => {
    await review.findByIdAndDelete(id);
    return true;
  },
  updateCategory: async (parent, { id, input }) => {
    // { new: true }: This is an options object. The new option, when set to true, means that the method
    // should return the updated document. If new is false or not provided, the method would return the original
    // document before it was updated.
    const updatedCategory = await category.findByIdAndUpdate(id, input, {
      new: true,
    });
    return updatedCategory;
  },
};
