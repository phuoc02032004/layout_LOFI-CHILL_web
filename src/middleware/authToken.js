import axios from 'axios';
import jwt from 'jsonwebtoken';

export function accessToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.headers["x-refresh-token"];

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is missing" });
      }

      try {
        const response = axios.post("http://localhost:3002/api/v1/auth/refreshToken", {
          refreshToken: refreshToken
        });
        const newAccessToken = response.data.accessToken;
        res.set("authorization", newAccessToken);
        next();
      } catch (refreshError) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
    } else {
      return res.status(403).json({ message: "Invalid access token" });
    }
  }
}