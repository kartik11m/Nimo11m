const Event = require('../models/Event')

// Get all events (upcoming and past)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ order: 1 })
    res.json({ success: true, events })
  } catch (error) {
    console.error('Error fetching events:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPast: false }).sort({ order: 1 })
    res.json({ success: true, events })
  } catch (error) {
    console.error('Error fetching upcoming events:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all past events
exports.getPastEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPast: true }).sort({ order: -1 })
    res.json({ success: true, events })
  } catch (error) {
    console.error('Error fetching past events:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.eventId })
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }
    res.json({ success: true, event })
  } catch (error) {
    console.error('Error fetching event:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { eventId, type, featured, status, isPast, title, sub, desc, day, month, year, monthFull, time, duration, venue, seats, filled, target, tags, price, num, attendees, highlight } = req.body

    if (!eventId || !type || !status || !title || !sub || !desc) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const existing = await Event.findOne({ eventId })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Event ID already exists' })
    }

    const order = await Event.countDocuments()
    const event = new Event({
      eventId,
      type,
      featured: featured || false,
      status,
      isPast: isPast || false,
      title,
      sub,
      desc,
      day,
      month,
      year,
      monthFull,
      time,
      duration,
      venue,
      seats: seats || 0,
      filled: filled || 0,
      target: target ? new Date(target) : null,
      tags: tags || [],
      price,
      num,
      attendees: attendees || 0,
      highlight: highlight || '',
      order,
    })

    await event.save()
    res.json({ success: true, event, message: 'Event created successfully' })
  } catch (error) {
    console.error('Error creating event:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params
    const updateData = req.body

    const event = await Event.findOne({ eventId })
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // If day/month/year are provided, calculate the target date BEFORE Object.assign
    if (updateData.day && updateData.month && updateData.year) {
      const monthMap = {
        'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
        'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
      }
      const day = parseInt(updateData.day)
      const monthNum = monthMap[updateData.month.toUpperCase()] ?? 0
      const year = parseInt(updateData.year)
      
      // Extract time from update data or fall back to existing time
      let time = updateData.time || event.time || '10:00 AM'
      
      // Parse time - handle formats like "10:00 AM – 4:00 PM" or "10:00 AM"
      const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)?/i)
      let hours = 10, minutes = 0
      if (timeMatch) {
        hours = parseInt(timeMatch[1])
        minutes = parseInt(timeMatch[2])
        const period = timeMatch[3]?.toUpperCase()
        if (period === 'PM' && hours !== 12) hours += 12
        if (period === 'AM' && hours === 12) hours = 0
      }
      
      updateData.target = new Date(year, monthNum, day, hours, minutes, 0, 0)
      console.log(`Calculated target: ${updateData.target} from day=${day}, month=${monthNum}, year=${year}, hours=${hours}, minutes=${minutes}`)
    }

    Object.assign(event, updateData)
    
    if (updateData.target && typeof updateData.target === 'string') {
      event.target = new Date(updateData.target)
    }
    
    event.updatedAt = Date.now()

    await event.save()
    res.json({ success: true, event, message: 'Event updated successfully' })
  } catch (error) {
    console.error('Error updating event:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params

    const event = await Event.findOneAndDelete({ eventId })
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    res.json({ success: true, message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}
