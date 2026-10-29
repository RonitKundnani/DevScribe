import prisma from '../prisma.js';

// Helper to calculate reading time based on word count
const getReadingTime = (content) => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200)); // Average reading speed ~200 wpm
};

// Helper to generate a clean URL slug from title
const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomSuffix}`;
};

// Fetch all articles with optional tag and search filters
export const getArticles = async (req, res) => {
  try {
    const { tag, search } = req.query;
    const where = {};

    if (tag && tag !== 'all') {
      where.tags = { contains: tag.toLowerCase() };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } }
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    });

    return res.json(articles);
  } catch (error) {
    console.error('getArticles error:', error);
    return res.status(500).json({ message: 'Failed to fetch articles.' });
  }
};

// Fetch a single article by its slug
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true, bio: true }
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, username: true, avatar: true }
            }
          }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    return res.json(article);
  } catch (error) {
    console.error('getArticleBySlug error:', error);
    return res.status(500).json({ message: 'Failed to fetch article details.' });
  }
};

// Create a new article
export const createArticle = async (req, res) => {
  try {
    const { title, summary, content, tags, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const slug = generateSlug(title);
    const readTime = getReadingTime(content);
    const cleanTags = tags ? tags.toLowerCase().trim() : 'general';

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug,
        summary: summary ? summary.trim() : content.substring(0, 150) + '...',
        content,
        tags: cleanTags,
        coverImage: coverImage ? coverImage.trim() : '',
        readTime,
        authorId: req.user.id
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      }
    });

    return res.status(201).json(article);
  } catch (error) {
    console.error('createArticle error:', error);
    return res.status(500).json({ message: 'Failed to publish article.' });
  }
};

// Delete an article (only by the author)
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    if (article.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this article.' });
    }

    await prisma.article.delete({ where: { id } });
    return res.json({ message: 'Article deleted successfully.' });
  } catch (error) {
    console.error('deleteArticle error:', error);
    return res.status(500).json({ message: 'Failed to delete article.' });
  }
};

// Toggle like / unlike on an article
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user already liked this article
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: { userId, articleId: id }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      const likesCount = await prisma.like.count({ where: { articleId: id } });
      return res.json({ liked: false, likesCount });
    } else {
      await prisma.like.create({
        data: { userId, articleId: id }
      });
      const likesCount = await prisma.like.count({ where: { articleId: id } });
      return res.json({ liked: true, likesCount });
    }
  } catch (error) {
    console.error('toggleLike error:', error);
    return res.status(500).json({ message: 'Failed to toggle like.' });
  }
};

// Add a comment to an article
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content cannot be empty.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: req.user.id,
        articleId: id
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      }
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error('addComment error:', error);
    return res.status(500).json({ message: 'Failed to add comment.' });
  }
};
