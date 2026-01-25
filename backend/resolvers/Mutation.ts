// Use Prisma client and types
export interface CategoryInput {
  name: string;
}

export interface ProductInput {
  name: string;
  image: string;
  price: number;
  onSale: boolean;
  quantity: number;
  categoryId: number;
  description: string;
}

export interface ProductInputs {
  products: ProductInput[];
}

export interface ReviewInput {
  date: Date;
  title: string;
  comment: string;
  rating: number;
  productId: number;
}

export interface UserInput {
  username: string;
  password: string;
  role: string;
}

export interface addToCartInput {
  userId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface removeFromCartInput {
  userId: number;
  productId: number;
}

export interface updateCartInput {
  userId: number;
  productId: number;
  quantity: number;
}

export interface deleteCategoryQuery {
  categoryID: number;
}

export interface deleteProductQuery {
  productID: number;
}

export interface deleteReviewQuery {
  reviewID: number;
}

export interface updateCategoryInput {
  name: string;
}

export interface Context {
  prisma: any;
  user: {
    id: number;
    username: string;
    password: string;
    role: string;
  };
}

export interface MyError {
  errmsg: string;
  code: number;
}
