import jwt from "express-jwt";
import jwksClient from "jwks-client";

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // 10 minutes
});

const getKey = (header: any, callback: any): void => {
  client.getSigningKey(header.kid, (err: Error | null, key: any) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

const authMiddleware = jwt({
  secret: getKey,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  requestProperty: "user",
});

export default authMiddleware;
