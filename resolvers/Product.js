exports.Product = {
  category: (parent, args, { db }) => {
    const categoryId = parent.categoryId;
    return db.categories.find((category) => category.id === categoryId);
  },

  reviews: ({ id }, args, { db }) => {
    return db.reviews.filter((review) => review.productId === id);
  },
};
