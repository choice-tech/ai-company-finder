
export interface Business {
  id: string;
  name: string;
  phone?: string;
  website?: string;
  email?: string;
  address: string;
  rating?: number;
  priceLevel?: number;
  types: string[];
  placeId: string;
}

export interface SearchParams {
  query: string;
  location: string;
  radius?: number;
}
