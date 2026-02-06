import jwt from 'jsonwebtoken'

export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.adminId = decoded.adminId;
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};