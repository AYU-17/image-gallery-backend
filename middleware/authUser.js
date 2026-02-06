import jwt from 'jsonwebtoken'

export const authUser = (req, res, next) => {
  try {
    const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "User access required" });
    }

    req.userId = decoded.userId;
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};