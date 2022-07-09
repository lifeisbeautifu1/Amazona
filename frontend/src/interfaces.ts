export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  countInStock: number;
  brand: string;
  rating: number;
  numReviews: number;
  description: string;
}

export interface IUserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrderItem {
  slug: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
  _id: string;
}

export interface IOrder {
  shippingAddress: IShippingAddress;
  _id: string;
  orderItems: IOrderItem[];
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: string;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
}