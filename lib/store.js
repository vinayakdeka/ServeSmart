export const STATUSES = [
  'Open',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
]
export const PRIORITIES = ['P1', 'P2', 'P3', 'P4']
export const CATEGORIES = [
  'AV Equipment',
  'Network',
  'Furniture',
  'Plumbing',
  'HVAC',
  'Equipment',
  'Building',
  'Security',
  'Electrical',
  'Facilities',
]
export const MIN_DESCRIPTION_LENGTH = 10

export const users = [
  { id: 'stu1', name: 'Ava Patel', role: 'student' },
  { id: 'stu2', name: 'Liam Chen', role: 'student' },
  { id: 'stu3', name: 'Maya Singh', role: 'student' },
  { id: 'stu4', name: 'Noah Kim', role: 'student' },
  { id: 'stu5', name: 'Zoe Rivera', role: 'student' },
  { id: 'stu6', name: 'Ethan Wood', role: 'student' },
  { id: 'stu7', name: 'Priya Nair', role: 'student' },
  { id: 'stu8', name: 'Omar Ali', role: 'student' },
  { id: 'stu9', name: 'Grace Lin', role: 'student' },
  { id: 'stu10', name: 'Jack Ford', role: 'student' },
  { id: 'tech1', name: 'Sam Torres', role: 'technician' },
  { id: 'tech2', name: 'Dana Brooks', role: 'technician' },
  { id: 'tech3', name: 'Ravi Desai', role: 'technician' },
  { id: 'admin1', name: 'Chris Park', role: 'admin' },
]

const seedTickets = [
  {
    id: '1',
    title: 'Projector not turning on',
    description: 'The classroom projector in Hall A does not power on at all.',
    category: 'AV Equipment',
    location: 'Hall A - Room 101',
    priority: 'P1',
    status: 'Open',
    studentId: 'stu1',
    technicianId: null,
  },
  {
    id: '2',
    title: 'WiFi not working',
    description:
      'WiFi has been down on the 2nd floor of the library since this morning.',
    category: 'Network',
    location: 'Library - 2nd Floor',
    priority: 'P3',
    status: 'Open',
    studentId: 'stu2',
    technicianId: null,
  },
  {
    id: '3',
    title: 'Broken chair in classroom',
    description: 'One of the chairs in room 210 has a broken leg.',
    category: 'Furniture',
    location: 'Room 210',
    priority: 'P4',
    status: 'Open',
    studentId: 'stu3',
    technicianId: null,
  },
  {
    id: '4',
    title: 'Leaking pipe under sink',
    description:
      'There is a steady water leak under the sink in the dorm B bathroom.',
    category: 'Plumbing',
    location: 'Dorm B - Common Bathroom',
    priority: 'P2',
    status: 'Assigned',
    studentId: 'stu4',
    technicianId: 'tech1',
  },
  {
    id: '5',
    title: 'AC not cooling',
    description:
      'The air conditioning unit in lab 3 runs but does not cool the room.',
    category: 'HVAC',
    location: 'Lab 3',
    priority: 'P1',
    status: 'Assigned',
    studentId: 'stu5',
    technicianId: 'tech2',
  },
  {
    id: '6',
    title: 'Printer paper jam',
    description: 'The admin office printer jams every few pages printed.',
    category: 'Equipment',
    location: 'Admin Office',
    priority: 'P3',
    status: 'Assigned',
    studentId: 'stu6',
    technicianId: 'tech3',
  },
  {
    id: '7',
    title: 'Elevator stuck between floors',
    description: 'The elevator in building C got stuck this morning.',
    category: 'Building',
    location: 'Building C',
    priority: 'P1',
    status: 'In Progress',
    studentId: 'stu7',
    technicianId: 'tech1',
  },
  {
    id: '8',
    title: 'Door lock broken',
    description: 'The door lock to room 305 does not latch properly.',
    category: 'Security',
    location: 'Room 305',
    priority: 'P2',
    status: 'In Progress',
    studentId: 'stu8',
    technicianId: 'tech2',
  },
  {
    id: '9',
    title: 'Light flickering in hallway',
    description: 'The overhead lights in hallway 2 flicker constantly.',
    category: 'Electrical',
    location: 'Hallway 2',
    priority: 'P4',
    status: 'In Progress',
    studentId: 'stu9',
    technicianId: 'tech3',
  },
  {
    id: '10',
    title: 'Whiteboard needs replacement',
    description: 'The whiteboard in room 112 is cracked and unusable.',
    category: 'Furniture',
    location: 'Room 112',
    priority: 'P2',
    status: 'Resolved',
    studentId: 'stu10',
    technicianId: 'tech1',
  },
  {
    id: '11',
    title: 'Fan not working',
    description: 'The ceiling fan in room 220 does not turn on.',
    category: 'Electrical',
    location: 'Room 220',
    priority: 'P3',
    status: 'Resolved',
    studentId: 'stu1',
    technicianId: 'tech2',
  },
  {
    id: '12',
    title: 'Trash bin missing',
    description: 'The trash bin that used to be in room 108 is missing.',
    category: 'Facilities',
    location: 'Room 108',
    priority: 'P4',
    status: 'Closed',
    studentId: 'stu2',
    technicianId: 'tech3',
  },
]

// Hours ago each seeded ticket was created (same order as seedTickets)
const SEED_AGE_HOURS = [5, 4, 30, 26, 8, 52, 3, 28, 75, 100, 96, 200]

// Adds timestamps and an activity log matching the ticket's status, so the
// detail page and the PATCH handler always find `activity`.
function withHistory(ticket, hoursAgo) {
  const end = Date.now()
  const start = end - hoursAgo * 60 * 60 * 1000
  const student = findUser(ticket.studentId)
  const tech = findUser(ticket.technicianId)
  const stage = STATUSES.indexOf(ticket.status)

  const steps = [
    {
      type: 'created',
      message: `Submitted by ${student ? student.name : 'student'}`,
    },
  ]
  if (stage >= 1) {
    steps.push({
      type: 'assigned',
      message: `Assigned to ${tech ? tech.name : 'technician'}`,
    })
  }
  STATUSES.slice(2, stage + 1).forEach((s) =>
    steps.push({ type: 'status', message: `Status changed to ${s}` }),
  )

  const activity = steps.map((step, i) => ({
    id: `a${i + 1}`,
    ...step,
    at: new Date(start + ((end - start) * i) / steps.length).toISOString(),
  }))

  return {
    ...ticket,
    createdAt: activity[0].at,
    updatedAt: activity[activity.length - 1].at,
    activity,
  }
}

// State lives on globalThis so every API route (and dev hot reloads) share one copy.
const globalStore =
  globalThis.__servesmartStore ||
  (globalThis.__servesmartStore = {
    tickets: seedTickets.map((t, i) => withHistory(t, SEED_AGE_HOURS[i])),
    nextId: seedTickets.length + 1,
  })

export const tickets = globalStore.tickets

export function generateId() {
  return String(globalStore.nextId++)
}

export function findUser(id) {
  return users.find((u) => u.id === id) || null
}
