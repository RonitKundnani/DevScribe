import prisma from '../prisma.js';

// Get code snippets with optional language filter or search
export const getSnippets = async (req, res) => {
  try {
    const { language, search } = req.query;
    const where = {};

    if (language && language !== 'all') {
      where.language = language.toLowerCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { code: { contains: search } }
      ];
    }

    const snippets = await prisma.snippet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      }
    });

    return res.json(snippets);
  } catch (error) {
    console.error('getSnippets error:', error);
    return res.status(500).json({ message: 'Failed to fetch code snippets.' });
  }
};

// Create a new code snippet
export const createSnippet = async (req, res) => {
  try {
    const { title, description, code, language } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: 'Title and code are required.' });
    }

    const snippet = await prisma.snippet.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : '',
        code,
        language: language ? language.toLowerCase().trim() : 'javascript',
        authorId: req.user.id
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      }
    });

    return res.status(201).json(snippet);
  } catch (error) {
    console.error('createSnippet error:', error);
    return res.status(500).json({ message: 'Failed to save code snippet.' });
  }
};

// Delete a snippet (author only)
export const deleteSnippet = async (req, res) => {
  try {
    const { id } = req.params;

    const snippet = await prisma.snippet.findUnique({ where: { id } });

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found.' });
    }

    if (snippet.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this snippet.' });
    }

    await prisma.snippet.delete({ where: { id } });
    return res.json({ message: 'Snippet deleted successfully.' });
  } catch (error) {
    console.error('deleteSnippet error:', error);
    return res.status(500).json({ message: 'Failed to delete snippet.' });
  }
};
