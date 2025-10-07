import { Request } from "express";

export interface User {
  id: string;
  auth0_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  auth0_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  is_active?: boolean;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  is_active?: boolean;
}

export interface Auth0User {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}

export interface Auth0Config {
  domain: string;
  audience: string;
  clientId: string;
  clientSecret: string;
}

export interface JWTConfig {
  secret: string;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  auth0: Auth0Config;
  jwt: JWTConfig;
  rateLimit: RateLimitConfig;
}

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    [key: string]: any;
  };
}

export interface UserFilters {
  is_active?: boolean;
  email?: string;
}

export interface LogData {
  method: string;
  url: string;
  status: number;
  duration: string;
  userAgent?: string;
  ip?: string;
  timestamp: string;
}
