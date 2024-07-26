exports.Category = {
  // Modify the below method with MongoDB collections
  products: ({ id }, { filter }, { db }) => {
    let filterCategoryProducts = db.products.filter(
      (product) => product.categoryId === id
    );
    console.log(filterCategoryProducts);
    if (filter) {
      if (filter.onSale === true) {
        filterCategoryProducts = filterCategoryProducts.filter(
          (product) => product.onSale === true
        );
        console.log(filterCategoryProducts);
      } else if (filter.onSale === false) {
        filterCategoryProducts = filterCategoryProducts.filter(
          (product) => product.onSale === false
        );
      }
    }
    console.log(filterCategoryProducts);
    return filterCategoryProducts;
  },
};
