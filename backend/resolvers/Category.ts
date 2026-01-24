// Use Prisma client and types
export interface Filter {
  onSale?: boolean;
}

export interface Context {
  prisma: any;
}

export interface Args {
  filter: Filter;
}

export interface Query {
  categoryId: number;
  onSale?: boolean;
}
