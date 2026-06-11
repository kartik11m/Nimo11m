const Post = require('../models/Post')
const { AppError } = require('../middleware/errorHandler')

// ── Helper: Generate slug from title ──────────────────────────
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ── Create Blog Post ──────────────────────────────────────────
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, excerpt, image, tags, featured, published } = req.body

    // Validation
    if (!title || !content || !category) {
      return next(new AppError('Title, content, and category are required', 400))
    }

    // Create slug
    const slug = generateSlug(title)

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug })
    if (existingPost) {
      return next(new AppError('A post with this title already exists', 400))
    }

    // Calculate read time (roughly 200 words per minute)
    const readTime = Math.ceil(content.split(' ').length / 200)

    const post = await Post.create({
      title,
      slug,
      content,
      category,
      excerpt: excerpt || content.substring(0, 150),
      image,
      author: req.user.id,
      featured: featured || false,
      published: published || false,
      readTime,
      tags: tags || [],
    })

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    })
  } catch (error) {
    next(error)
  }
}

// ── Update Blog Post ──────────────────────────────────────────
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, content, category, excerpt, image, tags, featured, published } = req.body

    let post = await Post.findById(id)

    if (!post) {
      return next(new AppError('Post not found', 404))
    }

    // Update slug if title changed
    let slug = post.slug
    if (title && title !== post.title) {
      slug = generateSlug(title)
      const existingPost = await Post.findOne({ slug, _id: { $ne: id } })
      if (existingPost) {
        return next(new AppError('A post with this title already exists', 400))
      }
    }

    // Recalculate read time if content changed
    let readTime = post.readTime
    if (content && content !== post.content) {
      readTime = Math.ceil(content.split(' ').length / 200)
    }

    // Update post
    post = await Post.findByIdAndUpdate(
      id,
      {
        title: title || post.title,
        slug,
        content: content || post.content,
        category: category || post.category,
        excerpt: excerpt || post.excerpt,
        image: image || post.image,
        featured: featured !== undefined ? featured : post.featured,
        published: published !== undefined ? published : post.published,
        readTime,
        tags: tags || post.tags,
      },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post,
    })
  } catch (error) {
    next(error)
  }
}

// ── Delete Blog Post ──────────────────────────────────────────
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params

    const post = await Post.findByIdAndDelete(id)

    if (!post) {
      return next(new AppError('Post not found', 404))
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// ── Get All Posts (with filters) ──────────────────────────────
exports.getAllPosts = async (req, res, next) => {
  try {
    const { category, published, featured, sort } = req.query

    // Build filter
    let filter = {}
    if (category) filter.category = category
    if (published !== undefined) filter.published = published === 'true'
    if (featured !== undefined) filter.featured = featured === 'true'

    // Build sort
    let sortBy = '-createdAt' // default: newest first
    if (sort === 'oldest') sortBy = 'createdAt'
    if (sort === 'title') sortBy = 'title'

    const posts = await Post.find(filter)
      .sort(sortBy)
      .populate('author', 'name email')

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    })
  } catch (error) {
    next(error)
  }
}

// ── Get Single Post (admin view) ───────────────────────────────
exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params

    const post = await Post.findById(id).populate('author', 'name email')

    if (!post) {
      return next(new AppError('Post not found', 404))
    }

    res.status(200).json({
      success: true,
      post,
    })
  } catch (error) {
    next(error)
  }
}

// ── Publish/Unpublish Post ────────────────────────────────────
exports.togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params

    const post = await Post.findById(id)

    if (!post) {
      return next(new AppError('Post not found', 404))
    }

    post.published = !post.published
    await post.save()

    res.status(200).json({
      success: true,
      message: `Post ${post.published ? 'published' : 'unpublished'} successfully`,
      post,
    })
  } catch (error) {
    next(error)
  }
}
