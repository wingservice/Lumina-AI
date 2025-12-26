
export enum AspectRatio {
  SQUARE = "1:1",
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16",
  CLASSIC = "4:3",
  WIDE = "21:9"
}

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  isAdmin?: boolean;
  avatar?: string;
}

export interface UserCredentials {
  email: string;
  password?: string;
  name?: string;
}

export interface GeneratedImage {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: string;
  timestamp: number;
  isFavorite?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalCredits: number;
  totalImages: number;
  activeToday: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  externalLink?: string;
}
