import jwt from 'jsonwebtoken'
import User from '../models/user.js';
import admin from '../config/firebase.js';

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { uid, email, name } = decodedToken;

    let user = await User.findOne({ googleId: uid });

    if (!user) {
      user = await User.create({
        googleId: uid,
        email,
        name
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('userToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(200).json({
      message: "Login successful",
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid Firebase token",
      error: error.message
    });
  }
};