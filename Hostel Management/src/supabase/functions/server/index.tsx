import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*']
}))
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Helper function to get user from access token
async function getUser(accessToken: string) {
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user) {
    return null
  }
  return user
}

// Initialize default data
app.get('/make-server-e0452d3f/init', async (c) => {
  try {
    console.log('Starting database initialization...')
    
    // Initialize rooms with varied statuses
    const rooms = [
      {
        id: '101',
        number: '101',
        keyAvailable: false,
        hasNightPassRequest: false,
        students: ['ST001', 'ST002', 'ST003', 'ST004']
      },
      {
        id: '102', 
        number: '102',
        keyAvailable: true,
        hasNightPassRequest: true,
        students: ['ST005', 'ST006', 'ST007', 'ST008']
      },
      {
        id: '103',
        number: '103', 
        keyAvailable: true,
        hasNightPassRequest: false,
        students: ['ST009', 'ST010', 'ST011', 'ST012']
      },
      {
        id: '104',
        number: '104',
        keyAvailable: false,
        hasNightPassRequest: true,
        students: ['ST013', 'ST014', 'ST015']
      },
      {
        id: '105',
        number: '105',
        keyAvailable: true,
        hasNightPassRequest: false,
        students: ['ST016', 'ST017', 'ST018', 'ST019']
      },
      {
        id: '106',
        number: '106',
        keyAvailable: false,
        hasNightPassRequest: false,
        students: ['ST020', 'ST021']
      },
      {
        id: '107',
        number: '107',
        keyAvailable: true,
        hasNightPassRequest: false,
        students: ['ST022', 'ST023', 'ST024', 'ST025']
      },
      {
        id: '108',
        number: '108',
        keyAvailable: false,
        hasNightPassRequest: true,
        students: ['ST026', 'ST027', 'ST028']
      }
    ]

    console.log('Initializing rooms...')
    for (const room of rooms) {
      await kv.set(`room:${room.id}`, room)
    }

    // Initialize users with Supabase Auth accounts
    const users = [
      // Room 101 - All approved
      { id: 'ST001', name: 'John Doe', registrationNumber: 'ST001', role: 'student', roomNumber: '101', approved: true, password: 'password' },
      { id: 'ST002', name: 'Jane Smith', registrationNumber: 'ST002', role: 'student', roomNumber: '101', approved: true, password: 'password' },
      { id: 'ST003', name: 'Mike Johnson', registrationNumber: 'ST003', role: 'student', roomNumber: '101', approved: true, password: 'password' },
      { id: 'ST004', name: 'Sarah Wilson', registrationNumber: 'ST004', role: 'student', roomNumber: '101', approved: true, password: 'password' },
      
      // Room 102 - Mixed approval status
      { id: 'ST005', name: 'Tom Brown', registrationNumber: 'ST005', role: 'student', roomNumber: '102', approved: false, password: 'password' },
      { id: 'ST006', name: 'Emily Davis', registrationNumber: 'ST006', role: 'student', roomNumber: '102', approved: true, password: 'password' },
      { id: 'ST007', name: 'Chris Miller', registrationNumber: 'ST007', role: 'student', roomNumber: '102', approved: true, password: 'password' },
      { id: 'ST008', name: 'Lisa Garcia', registrationNumber: 'ST008', role: 'student', roomNumber: '102', approved: false, password: 'password' },
      
      // Room 103 - All approved
      { id: 'ST009', name: 'David Martinez', registrationNumber: 'ST009', role: 'student', roomNumber: '103', approved: true, password: 'password' },
      { id: 'ST010', name: 'Anna Rodriguez', registrationNumber: 'ST010', role: 'student', roomNumber: '103', approved: true, password: 'password' },
      { id: 'ST011', name: 'Kevin Lee', registrationNumber: 'ST011', role: 'student', roomNumber: '103', approved: true, password: 'password' },
      { id: 'ST012', name: 'Maria Lopez', registrationNumber: 'ST012', role: 'student', roomNumber: '103', approved: true, password: 'password' },
      
      // Room 104 - Mixed approval (3 students)
      { id: 'ST013', name: 'James Taylor', registrationNumber: 'ST013', role: 'student', roomNumber: '104', approved: true, password: 'password' },
      { id: 'ST014', name: 'Rachel White', registrationNumber: 'ST014', role: 'student', roomNumber: '104', approved: false, password: 'password' },
      { id: 'ST015', name: 'Alex Chen', registrationNumber: 'ST015', role: 'student', roomNumber: '104', approved: true, password: 'password' },
      
      // Room 105 - All approved
      { id: 'ST016', name: 'Sophie Anderson', registrationNumber: 'ST016', role: 'student', roomNumber: '105', approved: true, password: 'password' },
      { id: 'ST017', name: 'Daniel Kim', registrationNumber: 'ST017', role: 'student', roomNumber: '105', approved: true, password: 'password' },
      { id: 'ST018', name: 'Jessica Wong', registrationNumber: 'ST018', role: 'student', roomNumber: '105', approved: true, password: 'password' },
      { id: 'ST019', name: 'Michael Park', registrationNumber: 'ST019', role: 'student', roomNumber: '105', approved: true, password: 'password' },
      
      // Room 106 - Small room with pending approvals (2 students)
      { id: 'ST020', name: 'Emma Thompson', registrationNumber: 'ST020', role: 'student', roomNumber: '106', approved: false, password: 'password' },
      { id: 'ST021', name: 'Ryan Clark', registrationNumber: 'ST021', role: 'student', roomNumber: '106', approved: false, password: 'password' },
      
      // Room 107 - All approved
      { id: 'ST022', name: 'Olivia Harris', registrationNumber: 'ST022', role: 'student', roomNumber: '107', approved: true, password: 'password' },
      { id: 'ST023', name: 'Noah Wilson', registrationNumber: 'ST023', role: 'student', roomNumber: '107', approved: true, password: 'password' },
      { id: 'ST024', name: 'Ava Johnson', registrationNumber: 'ST024', role: 'student', roomNumber: '107', approved: true, password: 'password' },
      { id: 'ST025', name: 'Ethan Davis', registrationNumber: 'ST025', role: 'student', roomNumber: '107', approved: true, password: 'password' },
      
      // Room 108 - Mixed approval (3 students)
      { id: 'ST026', name: 'Isabella Martin', registrationNumber: 'ST026', role: 'student', roomNumber: '108', approved: true, password: 'password' },
      { id: 'ST027', name: 'Lucas Garcia', registrationNumber: 'ST027', role: 'student', roomNumber: '108', approved: false, password: 'password' },
      { id: 'ST028', name: 'Mia Rodriguez', registrationNumber: 'ST028', role: 'student', roomNumber: '108', approved: true, password: 'password' },
      
      // Security and Warden users
      { id: 'security1', name: 'Security Guard 1', username: 'security1', role: 'security', password: 'password' },
      { id: 'security2', name: 'Security Guard 2', username: 'security2', role: 'security', password: 'password' },
      { id: 'warden', name: 'Hostel Warden', username: 'warden', role: 'warden', password: 'password' }
    ]

    console.log('Creating demo users with authentication...')
    for (const user of users) {
      try {
        // Create auth user
        const email = user.role === 'student' ? `${user.id}@hostel.local` : `${user.id}@hostel.admin`
        console.log(`Creating auth user for ${user.id} with email ${email}`)
        
        const { data, error } = await supabase.auth.admin.createUser({
          email: email,
          password: user.password,
          user_metadata: { 
            name: user.name, 
            registrationNumber: user.registrationNumber || user.username,
            role: user.role
          },
          email_confirm: true
        })

        if (error && error.message !== 'User already registered') {
          console.log(`Auth creation error for ${user.id}:`, error)
          // Continue with next user even if this one fails
        } else {
          console.log(`Successfully created auth user for ${user.id}`)
        }

        // Store user data in KV store (remove password from stored data)
        const { password, ...userWithoutPassword } = user
        const userData = {
          ...userWithoutPassword,
          authId: data?.user?.id
        }
        
        await kv.set(`user:${user.id}`, userData)
        
        // Also store security guards in security namespace
        if (user.role === 'security') {
          await kv.set(`security:${user.id}`, userData)
        }
        
        console.log(`Stored user data for ${user.id}`)
      } catch (userError) {
        console.log(`Failed to create user ${user.id}:`, userError)
        // Continue with next user
      }
    }

    // Initialize sample night pass requests for rooms that have pending requests
    const nightPassRequests = [
      {
        roomNumber: '102',
        request: {
          id: `${Date.now()}-ST006`,
          studentName: 'Emily Davis',
          registrationNumber: 'ST006',
          roomNumber: '102',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          arrivalTime: '23:30',
          dispatchTime: '18:00',
          reason: 'Family emergency - need to visit home',
          status: 'pending',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        }
      },
      {
        roomNumber: '104',
        request: {
          id: `${Date.now()}-ST013`,
          studentName: 'James Taylor',
          registrationNumber: 'ST013',
          roomNumber: '104',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          arrivalTime: '22:00',
          dispatchTime: '19:30',
          reason: 'Medical appointment in city',
          status: 'pending',
          submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
        }
      },
      {
        roomNumber: '108',
        request: {
          id: `${Date.now()}-ST026`,
          studentName: 'Isabella Martin',
          registrationNumber: 'ST026',
          roomNumber: '108',
          date: new Date().toISOString().split('T')[0], // Today
          arrivalTime: '23:59',
          dispatchTime: '20:00',
          reason: 'Part-time job shift ends late',
          status: 'pending',
          submittedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
        }
      }
    ]

    console.log('Creating sample night pass requests...')
    for (const { roomNumber, request } of nightPassRequests) {
      await kv.set(`nightpass:${roomNumber}`, request)
      console.log(`Created night pass request for room ${roomNumber}`)
    }

    // Initialize sample key transactions for demonstration
    const sampleTransactions = [
      {
        id: `${Date.now()-86400000}-ST001`, // Yesterday
        type: 'taking',
        name: 'John Doe',
        registrationNumber: 'ST001',
        roomNumber: '101',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:30',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${Date.now()-43200000}-ST009`, // 12 hours ago
        type: 'giving',
        name: 'David Martinez',
        registrationNumber: 'ST009',
        roomNumber: '103',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:15',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${Date.now()-10800000}-ST016`, // 3 hours ago
        type: 'giving',
        name: 'Sophie Anderson',
        registrationNumber: 'ST016',
        roomNumber: '105',
        date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '16:45',
        submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${Date.now()-7200000}-ST013`, // 2 hours ago  
        type: 'taking',
        name: 'James Taylor',
        registrationNumber: 'ST013',
        roomNumber: '104',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '17:20',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${Date.now()-3600000}-ST026`, // 1 hour ago
        type: 'taking',
        name: 'Isabella Martin',
        registrationNumber: 'ST026',
        roomNumber: '108',
        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '18:30',
        submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]

    console.log('Creating sample key transactions...')
    for (const transaction of sampleTransactions) {
      await kv.set(`transaction:${transaction.id}`, transaction)
      console.log(`Created transaction ${transaction.id}`)
    }

    console.log('Database initialization completed successfully')
    return c.json({ success: true, message: 'Database initialized with demo data' })
  } catch (error) {
    console.log('Error initializing database:', error)
    return c.json({ error: 'Failed to initialize database' }, 500)
  }
})

// Student registration
app.post('/make-server-e0452d3f/register', async (c) => {
  try {
    const body = await c.req.json()
    const { name, registrationNumber, roomNumber, password } = body

    // Check if user already exists
    const existingUser = await kv.get(`user:${registrationNumber}`)
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400)
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: `${registrationNumber}@hostel.local`,
      password: password,
      user_metadata: { 
        name, 
        registrationNumber, 
        roomNumber,
        role: 'student'
      },
      email_confirm: true // Auto-confirm since we don't have email server
    })

    if (error) {
      console.log('Auth creation error:', error)
      return c.json({ error: 'Failed to create user account' }, 500)
    }

    // Store user data in KV store
    const user = {
      id: registrationNumber,
      name,
      registrationNumber,
      role: 'student',
      roomNumber,
      approved: false,
      authId: data.user.id
    }

    await kv.set(`user:${registrationNumber}`, user)

    return c.json({ success: true, message: 'Registration submitted for approval' })
  } catch (error) {
    console.log('Registration error:', error)
    return c.json({ error: 'Failed to register user' }, 500)
  }
})

// User login
app.post('/make-server-e0452d3f/login', async (c) => {
  try {
    const body = await c.req.json()
    const { identifier, password } = body
    
    console.log(`Login attempt for identifier: ${identifier}`)

    // Get user from KV store
    const user = await kv.get(`user:${identifier}`)
    if (!user) {
      console.log(`User not found in KV store: ${identifier}`)
      return c.json({ error: 'User not found. Please initialize demo data first.' }, 404)
    }

    console.log(`Found user in KV store: ${user.name} (${user.role})`)

    // Check if student is approved
    if (user.role === 'student' && !user.approved) {
      console.log(`Student ${identifier} registration pending approval`)
      return c.json({ error: 'Registration pending approval' }, 403)
    }

    // Authenticate with Supabase
    const email = user.role === 'student' ? `${identifier}@hostel.local` : `${identifier}@hostel.admin`
    console.log(`Attempting Supabase auth with email: ${email}`)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.log(`Supabase auth error for ${identifier}:`, error)
      if (error.message.includes('Invalid login credentials')) {
        return c.json({ 
          error: 'Authentication failed. Please check your credentials or initialize demo data.' 
        }, 401)
      }
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    console.log(`Successfully authenticated user: ${identifier}`)
    
    return c.json({ 
      success: true, 
      user, 
      session: data.session 
    })
  } catch (error) {
    console.log('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Get all rooms
app.get('/make-server-e0452d3f/rooms', async (c) => {
  try {
    const rooms = await kv.getByPrefix('room:')
    const roomsWithStudents = []

    for (const room of rooms) {
      const students = []
      for (const studentId of room.students) {
        const student = await kv.get(`user:${studentId}`)
        if (student) {
          students.push({
            id: student.id,
            name: student.name,
            registrationNumber: student.registrationNumber
          })
        }
      }
      
      roomsWithStudents.push({
        ...room,
        students
      })
    }

    return c.json({ rooms: roomsWithStudents })
  } catch (error) {
    console.log('Error fetching rooms:', error)
    return c.json({ error: 'Failed to fetch rooms' }, 500)
  }
})

// Get room by number
app.get('/make-server-e0452d3f/rooms/:roomNumber', async (c) => {
  try {
    const roomNumber = c.req.param('roomNumber')
    const room = await kv.get(`room:${roomNumber}`)
    
    if (!room) {
      return c.json({ error: 'Room not found' }, 404)
    }

    // Get student details
    const students = []
    for (const studentId of room.students) {
      const student = await kv.get(`user:${studentId}`)
      if (student) {
        students.push({
          id: student.id,
          name: student.name,
          registrationNumber: student.registrationNumber
        })
      }
    }

    // Get night pass request if exists
    let nightPassRequest = null
    if (room.hasNightPassRequest) {
      nightPassRequest = await kv.get(`nightpass:${roomNumber}`)
    }

    return c.json({ 
      room: { 
        ...room, 
        students,
        nightPassRequest 
      } 
    })
  } catch (error) {
    console.log('Error fetching room:', error)
    return c.json({ error: 'Failed to fetch room' }, 500)
  }
})

// Give access to students (Security)
app.post('/make-server-e0452d3f/give-access', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const user = await getUser(accessToken)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { roomNumber } = body

    // Store access permission
    await kv.set(`access:${roomNumber}`, {
      granted: true,
      grantedBy: user.id,
      grantedAt: new Date().toISOString()
    })

    return c.json({ success: true, message: 'Access granted' })
  } catch (error) {
    console.log('Error granting access:', error)
    return c.json({ error: 'Failed to grant access' }, 500)
  }
})

// Submit key form (Student)
app.post('/make-server-e0452d3f/key-transaction', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const authUser = await getUser(accessToken)
    if (!authUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { type, name, registrationNumber, date, time, roomNumber } = body

    // Store transaction
    const transaction = {
      id: `${Date.now()}-${registrationNumber}`,
      type,
      name,
      registrationNumber,
      roomNumber,
      date,
      time,
      submittedAt: new Date().toISOString()
    }

    await kv.set(`transaction:${transaction.id}`, transaction)

    // Update room key status
    const room = await kv.get(`room:${roomNumber}`)
    if (room) {
      room.keyAvailable = type === 'giving'
      await kv.set(`room:${roomNumber}`, room)
    }

    // Remove access permission
    await kv.del(`access:${roomNumber}`)

    return c.json({ success: true, transaction })
  } catch (error) {
    console.log('Error recording key transaction:', error)
    return c.json({ error: 'Failed to record transaction' }, 500)
  }
})

// Submit night pass request (Student)
app.post('/make-server-e0452d3f/night-pass', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const authUser = await getUser(accessToken)
    if (!authUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { studentName, registrationNumber, roomNumber, date, arrivalTime, dispatchTime, reason } = body

    const nightPassRequest = {
      id: `${Date.now()}-${registrationNumber}`,
      studentName,
      registrationNumber,
      roomNumber,
      date,
      arrivalTime,
      dispatchTime,
      reason,
      status: 'pending',
      submittedAt: new Date().toISOString()
    }

    await kv.set(`nightpass:${roomNumber}`, nightPassRequest)

    // Update room to show night pass request
    const room = await kv.get(`room:${roomNumber}`)
    if (room) {
      room.hasNightPassRequest = true
      await kv.set(`room:${roomNumber}`, room)
    }

    return c.json({ success: true, nightPassRequest })
  } catch (error) {
    console.log('Error submitting night pass:', error)
    return c.json({ error: 'Failed to submit night pass request' }, 500)
  }
})

// Approve night pass (Warden)
app.post('/make-server-e0452d3f/approve-night-pass', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const authUser = await getUser(accessToken)
    if (!authUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { roomNumber } = body

    // Update night pass request
    const nightPassRequest = await kv.get(`nightpass:${roomNumber}`)
    if (nightPassRequest) {
      nightPassRequest.status = 'approved'
      nightPassRequest.approvedAt = new Date().toISOString()
      nightPassRequest.approvedBy = authUser.id
      await kv.set(`nightpass:${roomNumber}`, nightPassRequest)
    }

    // Update room to remove night pass request flag
    const room = await kv.get(`room:${roomNumber}`)
    if (room) {
      room.hasNightPassRequest = false
      await kv.set(`room:${roomNumber}`, room)
    }

    return c.json({ success: true, message: 'Night pass approved' })
  } catch (error) {
    console.log('Error approving night pass:', error)
    return c.json({ error: 'Failed to approve night pass' }, 500)
  }
})

// Get all students (Warden)
app.get('/make-server-e0452d3f/students', async (c) => {
  try {
    const users = await kv.getByPrefix('user:')
    const students = users.filter(user => user.role === 'student')
    return c.json({ students })
  } catch (error) {
    console.log('Error fetching students:', error)
    return c.json({ error: 'Failed to fetch students' }, 500)
  }
})

// Approve/Cancel student (Warden)
app.post('/make-server-e0452d3f/manage-student', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const authUser = await getUser(accessToken)
    if (!authUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { studentId, action } = body

    const student = await kv.get(`user:${studentId}`)
    if (!student) {
      return c.json({ error: 'Student not found' }, 404)
    }

    student.approved = action === 'activate'
    await kv.set(`user:${studentId}`, student)

    return c.json({ success: true, message: `Student ${action}d successfully` })
  } catch (error) {
    console.log('Error managing student:', error)
    return c.json({ error: 'Failed to manage student' }, 500)
  }
})

// Get all security guards (Warden)
app.get('/make-server-e0452d3f/securities', async (c) => {
  try {
    const securities = await kv.getByPrefix('security:')
    return c.json({ securities })
  } catch (error) {
    console.log('Error fetching securities:', error)
    return c.json({ error: 'Failed to fetch securities' }, 500)
  }
})

// Add security guard (Warden)
app.post('/make-server-e0452d3f/add-security', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const authUser = await getUser(accessToken)
    if (!authUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { name, phoneNumber, username, password } = body

    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: `${username}@hostel.admin`,
      password: password,
      user_metadata: { 
        name, 
        username,
        role: 'security'
      },
      email_confirm: true
    })

    if (error) {
      console.log('Security auth creation error:', error)
      return c.json({ error: 'Failed to create security account' }, 500)
    }

    const security = {
      id: username,
      name,
      phoneNumber,
      username,
      role: 'security',
      authId: data.user.id,
      createdAt: new Date().toISOString()
    }

    await kv.set(`security:${username}`, security)
    await kv.set(`user:${username}`, security)

    return c.json({ success: true, security })
  } catch (error) {
    console.log('Error adding security:', error)
    return c.json({ error: 'Failed to add security' }, 500)
  }
})

// Check access permission
app.get('/make-server-e0452d3f/check-access/:roomNumber', async (c) => {
  try {
    const roomNumber = c.req.param('roomNumber')
    const access = await kv.get(`access:${roomNumber}`)
    return c.json({ hasAccess: !!access })
  } catch (error) {
    console.log('Error checking access:', error)
    return c.json({ hasAccess: false })
  }
})

// Get transaction history
app.get('/make-server-e0452d3f/transactions', async (c) => {
  try {
    const transactions = await kv.getByPrefix('transaction:')
    
    // Sort by submission time (newest first)
    const sortedTransactions = transactions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    
    // Limit to most recent 50 transactions
    const recentTransactions = sortedTransactions.slice(0, 50)
    
    return c.json({ transactions: recentTransactions })
  } catch (error) {
    console.log('Error fetching transactions:', error)
    return c.json({ error: 'Failed to fetch transactions' }, 500)
  }
})

// Get night pass requests (for warden dashboard)
app.get('/make-server-e0452d3f/night-passes', async (c) => {
  try {
    const nightPasses = await kv.getByPrefix('nightpass:')
    
    // Sort by submission time (newest first)
    const sortedNightPasses = nightPasses.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    
    return c.json({ nightPasses: sortedNightPasses })
  } catch (error) {
    console.log('Error fetching night passes:', error)
    return c.json({ error: 'Failed to fetch night passes' }, 500)
  }
})

Deno.serve(app.fetch)