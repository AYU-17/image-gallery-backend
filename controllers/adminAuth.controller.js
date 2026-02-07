import Admin from "../models/admin.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Admin registered successfully",
      adminId: admin._id
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/'
    });

    res.status(200).json({
      message: "Login successful",
      token 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: "Logged out successfully" });
};