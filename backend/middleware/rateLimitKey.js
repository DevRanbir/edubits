const jwt = require("jsonwebtoken");
const { ipKeyGenerator } = require("express-rate-limit");

function readAuthToken(req) {
  const authorization = req.headers.authorization || "";
  const bearerToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearerToken) return bearerToken;

  const cookie = req.headers.cookie || "";
  const authCookie = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("edubits_auth="));

  return authCookie?.slice("edubits_auth=".length) || null;
}

function rateLimitKey(req) {
  const token = readAuthToken(req);

  if (token) {
    try {
      const session = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
      if (typeof session.id === "string" && session.id) return `user:${session.id}`;
    } catch {
      // Invalid or expired credentials use the anonymous IP bucket.
    }
  }

  return `ip:${ipKeyGenerator(req.ip)}`;
}

module.exports = rateLimitKey;
