const Course = require('../models/Course')

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ order: 1 })
    res.json({ success: true, courses })
  } catch (error) {
    console.error('Error fetching courses:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId })
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }
    res.json({ success: true, course })
  } catch (error) {
    console.error('Error fetching course:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { courseId, title, sub, level, category, description, duration, sessions, students, modules, price } = req.body

    if (!courseId || !title || !sub || !level || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const existing = await Course.findOne({ courseId })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Course ID already exists' })
    }

    const order = await Course.countDocuments()
    const course = new Course({
      courseId,
      title,
      sub,
      level,
      category,
      description,
      duration,
      sessions,
      students,
      modules: modules || [],
      price,
      order,
    })

    await course.save()
    res.status(201).json({ success: true, course })
  } catch (error) {
    console.error('Error creating course:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { title, sub, level, category, description, duration, sessions, students, modules, price } = req.body

    const course = await Course.findOneAndUpdate(
      { courseId: req.params.courseId },
      {
        title,
        sub,
        level,
        category,
        description,
        duration,
        sessions,
        students,
        modules,
        price,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    res.json({ success: true, course })
  } catch (error) {
    console.error('Error updating course:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ courseId: req.params.courseId })

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    res.json({ success: true, message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}
