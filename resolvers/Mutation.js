const { v4: uuid } = require("uuid");

exports.Mutation = {
  addNewCategory: (parent, { input }, { db }) => {
    const { name } = input;
    const newCategory = {
      id: uuid(),
      name,
    };
    db.categories.push(newCategory);

    return newCategory;
  },
  addNewProduct: (parent, { input }, { db }) => {
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
    db.products.push(newProduct);

    return newProduct;
  },
  deleteCategory: (parent, { id }, { db }) => {
    db.categories = db.categories.filter((category) => category.id !== id);
    db.products = db.products.map((product) => {
      if (product.categoryId === id)
        return {
          // The syntax ...product in JavaScript is called the spread syntax or spread operator.
          // It is used to expand an iterable (like an array or a string) into individual elements

          // Usage --> const product = ["Apple", "Banana", "Orange"];
          // console.log(...product);
          // Output: Apple Banana Orange
          ...product,
          categoryId: null,
        };
      else return product;
    });
    return true;
  },
  deleteProduct: (parent, { id }, { db }) => {
    db.products = db.products.filter((product) => product.id !== id);
    db.reviews = db.reviews.filter((review) => review.productId !== id);
    return true;
  },
  deleteReview: (parent, { id }, { db }) => {
    db.reviews = db.reviews.filter((review) => review.id !== id);
    return true;
  },
  updateCategory: (parent, { id, input }, { db }) => {
    const index = db.categories.findIndex((category) => category.id === id);
    db.categories[index] = {
      ...db.categories[index],
      ...input,
    };
    return db.categories[index];
  },
};
