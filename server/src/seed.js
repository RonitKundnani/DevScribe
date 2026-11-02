import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function seed() {
  console.log('Seeding initial data...');

  // Clear existing records to avoid duplicates
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.snippet.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  // 1. Create Users
  const ronit = await prisma.user.create({
    data: {
      name: 'Ronit Kundnani',
      username: 'ronitkundnani',
      email: 'ronitkundnani@gmail.com',
      password,
      bio: 'Full-stack software developer and engineering student.',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=ronitkundnani'
    }
  });

  const sarah = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      username: 'sarahcodes',
      email: 'sarah@example.com',
      password,
      bio: 'Software engineer building web apps and distributed systems.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    }
  });

  // 2. Create Sample Articles
  const article1 = await prisma.article.create({
    data: {
      title: 'Getting Started with Modern React State and Hooks',
      slug: 'getting-started-with-modern-react-state-and-hooks-ab12',
      summary: 'A practical guide to managing component state, custom hooks, and best practices in modern React.',
      tags: 'react,javascript,frontend',
      coverImage: '',
      readTime: 4,
      authorId: ronit.id,
      content: `# Getting Started with Modern React State and Hooks

React functional components combined with hooks make building reusable interfaces simpler and cleaner.

## 1. useState for Local State

The \`useState\` hook allows you to store state variables directly inside a function component.

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

## 2. Best Practices

- Keep your state local whenever possible.
- Group related state together using an object or a custom hook.
- Avoid unnecessary re-renders with memoization only when performance bottlenecks arise.
`
    }
  });

  await prisma.article.create({
    data: {
      title: 'Building Clean REST APIs with Node.js and Express',
      slug: 'building-clean-rest-apis-with-nodejs-and-express-cd34',
      summary: 'Learn how to structure controllers, routes, and error middleware for maintainable Express applications.',
      tags: 'nodejs,express,backend',
      coverImage: '',
      readTime: 5,
      authorId: sarah.id,
      content: `# Building Clean REST APIs with Node.js and Express

A structured architecture helps keep your backend maintainable as your project grows.

## 1. Controller Pattern

Separate route definition from business logic:

\`\`\`javascript
// controllers/articleController.js
export const getArticles = async (req, res) => {
  const articles = await prisma.article.findMany();
  res.json(articles);
};
\`\`\`

## 2. Centralized Error Handling

Use custom middleware to catch unhandled errors and format them into readable JSON responses.
`
    }
  });

  // 3. Create Sample Snippets
  await prisma.snippet.create({
    data: {
      title: 'Debounce Function in JavaScript',
      description: 'Delays invoking a callback until after a specified wait time has elapsed.',
      language: 'javascript',
      authorId: ronit.id,
      code: `function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`
    }
  });

  await prisma.snippet.create({
    data: {
      title: 'Axios Instance with Auth Token',
      description: 'Creates a pre-configured Axios instance that automatically attaches JWT tokens.',
      language: 'javascript',
      authorId: sarah.id,
      code: `import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;`
    }
  });

  // 4. Sample Interaction
  await prisma.like.create({
    data: {
      userId: sarah.id,
      articleId: article1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Great overview! The useState example is very straightforward.',
      userId: sarah.id,
      articleId: article1.id
    }
  });

  console.log('Database seeded successfully!');
  console.log('Account: ronitkundnani@gmail.com / password123');
}

seed()
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
