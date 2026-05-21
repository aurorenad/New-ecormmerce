export type Category = 'Excellent' | 'Good' | 'Fair' | 'countryside';

export interface Listing {
  id: number;

  title: string;

  current_price: number;

  original_price: number;

  img: string;

  category: Category;
}
