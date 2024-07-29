// MODIFIED....

const product = require("../models/productsModel");

exports.Category = {
  // Modify the below method with MongoDB collections
  products: async ({ id }, { filter }) => {
    let query = { categoryId: id };

    if (filter) {
      if (filter.onSale !== undefined) {
        query.onSale = filter.onSale;
      }
    }

    const filterCategoryProducts = await product.find(query);
    return filterCategoryProducts;
  },
};
