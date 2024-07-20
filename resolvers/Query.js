exports.Query = {
  // Actual resolver syntax is "fieldName: (parent, args, context, info) => data;"
  // parent-> This is the return value of the resolver for this field's parent (the resolver for a parent field always executes before the resolvers for that field's children)
  // args-> This object contains all GraphQl arguments provided for this field
  // context-> Authentication information and access to data source
  // info-> This contains information about the execution state of the operation (used only in advanced cases).
  products: (parent, { filter }, { db }) => {
    let filterProducts = db.products;

    if (filter) {
      if (filter.onSale === true) {
        filterProducts = filterProducts.filter(
          (product) => product.onSale === true
        );
      } else if (filter.onSale === false) {
        filterProducts = filterProducts.filter(
          (product) => product.onSale === false
        );
      }
    }
    return filterProducts;
  },
  product: (parent, args, { db }) => {
    const productID = args.id;
    const result = db.products.find((product) => product.id === productID);
    if (!result) return null;
    return result;
  },
  productByName: (parent, args, { db }) => {
    const productName = args.name;
    const result = db.products.find((product) => product.name === productName);
    if (!result) return null;
    return result;
  },
  categories: (parent, args, { db }) => db.categories,
  category: (parent, args, { db }) => {
    const { id } = args;
    const result = db.categories.find((category) => category.id === id);
    if (!result) return null;
    return result;
  },
  categoryByName: (parent, args, { db }) => {
    const { name } = args;
    const result = db.categories.find((category) => category.name === name);
    if (!result) return null;
    return result;
  },
};
