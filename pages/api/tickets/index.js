import {
  tickets,
  generateId,
  findUser,
  CATEGORIES,
  PRIORITIES,
  MIN_DESCRIPTION_LENGTH,
} from '../../../lib/store.js'

export default function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res)
  if (req.method === 'POST') return handlePost(req, res)
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed' })
}

function handleGet(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  const { studentId, technicianId, unassigned } = req.query
  let result = tickets

  if (studentId) result = result.filter((t) => t.studentId === studentId)
  if (technicianId)
    result = result.filter((t) => t.technicianId === technicianId)
  if (unassigned === 'true') result = result.filter((t) => !t.technicianId)

  return res.status(200).json({ tickets: result })
}

function handlePost(req, res) {
  const { title, description, category, location, priority, studentId } =
    req.body || {}

  // Identify the caller and enforce student role protection
  const callerId = req.headers['x-user-id'] || studentId
  if (!callerId) {
    return res.status(400).json({ error: 'Student ID is required.' })
  }
  const student = findUser(callerId)
  if (!student) {
    return res.status(400).json({ error: 'Student account not found.' })
  }
  if (student.role !== 'student') {
    return res.status(403).json({ error: 'Only students can create tickets.' })
  }

  // Required field validations
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required.' })
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'Description is required.' })
  }

  const trimmedDesc = description.trim()
  if (trimmedDesc.length < MIN_DESCRIPTION_LENGTH) {
    return res.status(400).json({
      error: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`,
    })
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: 'Category is required.' })
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Unknown category.' })
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return res.status(400).json({ error: 'Location is required.' })
  }

  if (!priority || typeof priority !== 'string' || !priority.trim()) {
    return res.status(400).json({ error: 'Priority is required.' })
  }
  if (!PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be P1, P2, P3, or P4.' })
  }

  const now = new Date().toISOString()

  // Default status must be 'Open'
  const ticket = {
    id: generateId(),
    title: title.trim(),
    description: trimmedDesc,
    category,
    location: location.trim(),
    priority,
    status: 'Open',
    studentId: student.id,
    technicianId: null,
    createdAt: now,
    updatedAt: now,
    activity: [
      {
        id: 'a1',
        type: 'created',
        message: `Submitted by ${student.name}`,
        at: now,
      },
    ],
  }

  tickets.push(ticket)
  return res.status(201).json({ ticket })
}
