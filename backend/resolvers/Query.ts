// Use Prisma client and types
export interface FilterProducts {
  onSale?: boolean;
}

export interface Args {
  filter?: FilterProducts;
  productId?: number;
  productName?: string;
  categoryId?: number;
  categoryName?: string;
  reviewId?: number;
  minRating?: number;
  maxRating?: number;
  userId?: number;
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

export interface IQueryName {
  name: string;
}
