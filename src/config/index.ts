import { AppConfig } from "../types";

const config: AppConfig = {
  development: {
    port: parseInt(process.env.PORT || "3000"),
    database: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      name: process.env.DB_NAME || "generic_backend_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
    },
    auth0: {
      domain: process.env.AUTH0_DOMAIN!,
      audience: process.env.AUTH0_AUDIENCE!,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    },
  },
  production: {
    port: parseInt(process.env.PORT || "3000"),
    database: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || "5432"),
      name: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
    },
    auth0: {
      domain: process.env.AUTH0_DOMAIN!,
      audience: process.env.AUTH0_AUDIENCE!,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    },
  },
  test: {
    port: parseInt(process.env.PORT || "3001"),
    database: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      name: process.env.DB_NAME || "generic_backend_test_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
    },
    auth0: {
      domain: process.env.AUTH0_DOMAIN!,
      audience: process.env.AUTH0_AUDIENCE!,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    },
    jwt: {
      secret: process.env.JWT_SECRET || "test-secret",
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 1000,
    },
  },
};

export default config;
