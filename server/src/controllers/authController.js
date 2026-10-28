import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

// Helper to generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'devscribe_jwt_secret_dev';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, username, email, password, bio } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Name, username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { username: cleanUsername }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({ message: 'Email is already registered.' });
      }
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        bio: bio ? bio.trim() : 'Developer on DevScribe',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);
    return res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Something went wrong during registration.' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password.' });
    }

    const cleanInput = identifier.toLowerCase().trim();

    // Find by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          { username: cleanInput }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong during login.' });
  }
};

// Get profile of current logged in user
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(user);
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};
