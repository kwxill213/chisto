export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  roleId: number;
  avatar?: string | null;
  phone?: string | null;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  pricePerSquare: number | null;
  basePrice: number | null;
  duration: number;
  category: string;
  image_url: string;
}

export interface Service {
  id: number;
  name: string;
  pricePerSquare: number | null;
  basePrice: number | null;
}

export interface PropertyType {
  description: string;
  id: number;
  name: string;
}

export interface Order {
  id: number;
  service: {
    name: string;
  };
  address: string;
  date: string;
  totalPrice: number;
  status: {
    id: number;
    description: string;
  };
  paymentStatus: string;
  description: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
};

export type Employee = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
};

export type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  typeId: number;
  relatedId?: number;
};