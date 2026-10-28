import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

// Middleware to verify JWT token and protect sensitive routes
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  try {
    // Verify token using secret key
    const secret = process.env.JWT_SECRET || 'devscribe_jwt_secret_dev';
    const decoded = jwt.verify(token, secret);

    // Fetch user details from database (excluding password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
