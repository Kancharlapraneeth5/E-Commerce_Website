// MODIFIED....

const category = require("../models/categoriesModel");
const product = require("../models/productsModel");

exports.Query = {
  // Actual resolver syntax is "fieldName: (parent, args, context, info) => data;"
  // parent-> This is the return value of the resolver for this field's parent (the resolver for a parent field always executes before the resolvers for that field's children)
  // args-> This object contains all GraphQl arguments provided for this field
  // context-> Authentication information and access to data source
  // info-> This contains information about the execution state of the operation (used only in advanced cases).
  products: async (parent, { filter }) => {
    let filterProducts;

    if (filter) {
      if (filter.onSale === true) {
        filterProducts = await product.find({ onSale: true });
      } else if (filter.onSale === false) {
        filterProducts = await product.find({ onSale: false });
      } else {
        filterProducts = await product.find();
      }
    }
    return filterProducts;
  },
  product: async (parent, args) => {
    const productID = args.id;
    const result = await product.findById(productID);
    return result;
  },
  productByName: async (parent, args, { db }) => {
    const productName = args.name;
    const result = await product.findOne({ name: productName });
    return result;
  },
  // for the below need MongoDB to be implemented
  categories: async () => {
    const result = await category.find();
    return result;
  },
  // for the below need MongoDB to be implemented
  category: async (parent, args) => {
    const { id } = args;
    const result = await category.findById(id);
    return result;
  },
  // for the below need MongoDB to be implemented
  categoryByName: async (parent, args, { db }) => {
    const { name } = args;
    const result = await category.findOne({ name });
    return result;
  },
};
