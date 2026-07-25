export interface Category {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug?: string;
  category: string | Category;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
