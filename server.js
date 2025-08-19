const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/handwritting';
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Email configuration
// Email configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: '01fe22bcs259@kletech.ac.in',
//     pass: 'swzk lukh byrh xema',
//   }
// });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'grapho.genius@gmail.com',
    pass: 'jxwk zaal cxbu jlmr',
  }
});




// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['Graphologist', 'Hiring Manager', 'Psychiatrist', 'Other']
  },
  otherRole: { type: String },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  verifiedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  department: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// User Activity Schema
const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // login, logout, register, verify
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// JWT Secret
const JWT_SECRET = 'your-secret-key-here';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// TEMPORARY: Create default admin (remove after use)
app.get('/create-default-admin', async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: 'admin@example.com' });
    if (existing) return res.send('Admin already exists.');

    const hashedPassword = await bcrypt.hash('admin123', 10); // default password
    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@example.com',
      mobile: '1234567890',
      department: 'IT',
      password: hashedPassword,
      isActive: true,
    });

    await admin.save();
    res.send('Default admin created. Use email: admin@example.com, password: admin123');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating admin');
  }
});


// Helper function to log user activity
const logActivity = async (userId, action, req) => {
  try {
    await UserActivity.create({
      userId,
      action,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Helper function to send email
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Grapho Genius" <grapho.genius@gmail.com>',
      to,
      subject,
      html
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, mobile, role, otherRole } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      mobile,
      role,
      otherRole: role === 'Other' ? otherRole : undefined
    });

    await user.save();
    await logActivity(user._id, 'register', req);

    // Send email to all admins
    const admins = await Admin.find({ isActive: true });
    const adminEmails = admins.map(admin => admin.email);

    const emailSubject = 'New User Registration - Approval Required';
    const emailHtml = `
      <h2>New User Registration</h2>
      <p>A new user has registered and requires approval:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Mobile:</strong> ${mobile}</li>
        <li><strong>Role:</strong> ${role}${role === 'Other' ? ` (${otherRole})` : ''}</li>
        <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>Please log in to the admin dashboard to approve or reject this user.</p>
    `;

    for (const adminEmail of adminEmails) {
      await sendEmail(adminEmail, emailSubject, emailHtml);
    }

    res.status(201).json({ 
      message: 'Registration successful. Please wait for admin approval.',
      userId: user._id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(401).json({ error: 'Invalid credentials or account not verified' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    await logActivity(user._id, 'login', req);

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        otherRole: user.otherRole
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending user requests (Admin only)
app.get('/api/admin/pending-users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const pendingUsers = await User.find({ isVerified: false }).sort({ createdAt: -1 });
    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify user (Admin only)
app.post('/api/admin/verify-user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    // Generate random password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.isVerified = true;
    user.verifiedBy = req.user.adminId;
    user.verifiedAt = new Date();
    await user.save();

    await logActivity(user._id, 'verify', req);

    // Send email to user with credentials
    const emailSubject = 'Account Approved - Login Credentials';
    const emailHtml = `
      <h2>Account Approved</h2>
      <p>Dear ${user.name},</p>
      <p>Your account has been approved by our admin team. You can now log in to the system using the following credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Password:</strong> ${tempPassword}</li>
      </ul>
      <p>Please log in and change your password for security purposes.</p>
      <p>Welcome to the Handwritten Pattern Prediction System!</p>
    `;

    await sendEmail(user.email, emailSubject, emailHtml);

    res.json({ message: 'User verified successfully and credentials sent via email' });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (Admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await User.find()
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user activities (Admin only)
app.get('/api/admin/user-activities', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const activities = await UserActivity.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User logout
app.post('/api/user/logout', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'user') {
      await logActivity(req.user.userId, 'logout', req);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////

// Define Client Schema
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  googleFormLink: String,
  googleFormResponseId: String,
  questionnaireScores: {
    Cumulative: Number,
    Investigative: Number,
    Comprehensive: Number,
    Analytical: Number
  },
  scriptScores: Object,
  combinedScores: Object,
  weight: { type: Number, default: 50 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', clientSchema);



const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Initialize auth with service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile: 'googleSheetsAPI.json', // Your downloaded JSON file
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// async function getScoresFromNewSheet(clientEmail) {
//   try {
//     const authClient = await auth.getClient();
//     const spreadsheetId = '1oYSj9bU3b5g-CzSCESbg8RAvuzj0dhXHdODRl_GhSno';
    
//     const spreadsheet = await sheets.spreadsheets.get({
//       auth: authClient,
//       spreadsheetId,
//     });

//     const sheetNames = spreadsheet.data.sheets.map(s => s.properties.title);
//     console.log('Available sheets:', sheetNames);

//     // Find the correct sheet (case-insensitive match)
//     const targetSheet = spreadsheet.data.sheets.find(s => 
//       s.properties.title.toLowerCase().includes('form responses 2')
//     );

//     if (!targetSheet) {
//       console.error('No matching sheet found');
//       return null;
//     }

//     const sheetName = targetSheet.properties.title;
//     console.log(`Using sheet: ${sheetName}`);

//     // Get all data from the sheet
//     const response = await sheets.spreadsheets.values.get({
//       auth: authClient,
//       spreadsheetId,
//       range: `${sheetName}!A:Z`, // Adjust range as needed
//     });

//     const rows = response.data.values;
//     if (!rows || rows.length === 0) {
//       console.log('No data found in sheet');
//       return null;
//     }

//     // Log headers for debugging
//     console.log('Headers:', rows[0]);

//     // Find column indexes dynamically based on headers
//     const headers = rows[0].map(h => h.toLowerCase());
//     const emailColIndex = headers.findIndex(h => h.includes('email'));
//     const cumulativeColIndex = headers.findIndex(h => h.includes('cumulative'));
//     const comprehensiveColIndex = headers.findIndex(h => h.includes('comprehensive'));
//     const investigativeColIndex = headers.findIndex(h => h.includes('investigative'));
//     const analyticalColIndex = headers.findIndex(h => h.includes('analytical'));

//     console.log('Found columns:', {
//       email: emailColIndex,
//       cumulative: cumulativeColIndex,
//       comprehensive: comprehensiveColIndex,
//       investigative: investigativeColIndex,
//       analytical: analyticalColIndex
//     });

//     // Find the row with matching email
//     for (let i = 1; i < rows.length; i++) {
//       const row = rows[i];
//       if (row[emailColIndex] && 
//           row[emailColIndex].toString().trim().toLowerCase() === clientEmail.trim().toLowerCase()) {
//         console.log('Found matching row:', row);
//         return {
//           Cumulative: parseFloat(row[cumulativeColIndex]) || 0,
//           Comprehensive: parseFloat(row[comprehensiveColIndex]) || 0,
//           Investigative: parseFloat(row[investigativeColIndex]) || 0,
//           Analytical: parseFloat(row[analyticalColIndex]) || 0
//         };
//       }
//     }

//     console.log(`No row found for email: ${clientEmail}`);
//     return null;
//   } catch (err) {
//     console.error('Google Sheets API error:', err);
//     if (err.response) {
//       console.error('API response error:', err.response.data);
//     }
//     return null;
//   }
// }
async function getScoresFromNewSheet(clientEmail) {
  try {
    const authClient = await auth.getClient();
    const spreadsheetId = '1oYSj9bU3b5g-CzSCESbg8RAvuzj0dhXHdODRl_GhSno';
    
    // First, list all available sheets
    const spreadsheet = await sheets.spreadsheets.get({
      auth: authClient,
      spreadsheetId,
    });

    // Log all sheet names for debugging
    const sheetNames = spreadsheet.data.sheets.map(s => s.properties.title);
    console.log('Available sheets:', sheetNames);

    // Find the correct sheet (case-insensitive match)
    const targetSheet = spreadsheet.data.sheets.find(s => 
      s.properties.title.toLowerCase().includes('form responses 2')
    );

    if (!targetSheet) {
      console.error('No matching sheet found');
      return null;
    }

    const sheetName = targetSheet.properties.title;
    console.log(`Using sheet: ${sheetName}`);

    // Get all data from the sheet (extended range to include all columns)
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: `${sheetName}!A:BJ`, // Extended range to include all columns
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in sheet');
      return null;
    }

    // Log first row headers for verification
    console.log('Headers:', rows[0]);

    // Find column indexes dynamically based on headers
    const headers = rows[0].map(h => h.toString().toLowerCase());
    
    // Email is in column C (index 2)
    const emailColIndex = 2;
    
    // Find score columns (note the typo in "Comphrehensive")
    const cumulativeColIndex = headers.findIndex(h => h.includes('cumulative %'));
    const comprehensiveColIndex = headers.findIndex(h => h.includes('comphrehensive %')); // Note the typo
    const investigativeColIndex = headers.findIndex(h => h.includes('investigative %'));
    const analyticalColIndex = headers.findIndex(h => h.includes('analytical %'));

    console.log('Found columns:', {
      email: emailColIndex,
      cumulative: cumulativeColIndex,
      comprehensive: comprehensiveColIndex,
      investigative: investigativeColIndex,
      analytical: analyticalColIndex
    });

    // Verify we found all required columns
    if (cumulativeColIndex === -1 || comprehensiveColIndex === -1 || 
        investigativeColIndex === -1 || analyticalColIndex === -1) {
      console.error('Missing required score columns');
      return null;
    }

    // Find the row with matching email
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[emailColIndex] && 
          row[emailColIndex].toString().trim().toLowerCase() === clientEmail.trim().toLowerCase()) {
        console.log('Found matching row:', row);
        
        // Extract and parse scores
        return {
          Cumulative: parseFloat(row[cumulativeColIndex]) || 0,
          Comprehensive: parseFloat(row[comprehensiveColIndex]) || 0,
          Investigative: parseFloat(row[investigativeColIndex]) || 0,
          Analytical: parseFloat(row[analyticalColIndex]) || 0
        };
      }
    }

    console.log(`No row found for email: ${clientEmail}`);
    return null;
  } catch (err) {
    console.error('Google Sheets API error:', err.message);
    if (err.response) {
      console.error('API response error:', JSON.stringify(err.response.data, null, 2));
    }
    return null;
  }
}
app.get('/test-sheet', async (req, res) => {
  try {
    const testEmail = 'test@example.com'; // Replace with actual email from sheet
    const scores = await getScoresFromNewSheet(testEmail);
    
    if (!scores) {
      return res.status(404).json({ 
        error: 'No scores found',
        message: 'Make sure the email exists in the sheet and columns are correct'
      });
    }
    
    res.json({
      success: true,
      message: 'Successfully fetched scores from Google Sheet',
      scores
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch scores',
      details: err.message
    });
  }
});

app.get('/test-sheet-connection', async (req, res) => {
  try {
    const testEmail = 'test@example.com'; // Replace with an email from your sheet
    const scores = await getScoresFromNewSheet(testEmail);
    
    if (!scores) {
      return res.status(404).json({ error: 'No scores found for test email' });
    }
    
    res.json({
      success: true,
      message: 'Successfully connected to Google Sheets',
      scores
    });
  } catch (err) {
    console.error('Test connection error:', err);
    res.status(500).json({
      error: 'Failed to connect to Google Sheets',
      details: err.message
    });
  }
});

app.post('/api/clients', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const { name, email } = req.body;
    
    const client = new Client({
      name,
      email,
      googleFormLink: `https://docs.google.com/forms/d/e/1FAIpQLScVX1hndMaUFpQgPjG2EXcCimYhMTFNR-8t5QdVV1kr9flNAQ/viewform?usp=pp_url&entry.1234567890=${encodeURIComponent(email)}`,
      createdBy: req.user.userId
    });
    
    await client.save();
    
    // Send email to client
    const emailSubject = 'Please complete your handwriting analysis questionnaire';
    const emailHtml = `
      <p>Dear ${name},</p>
      <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
      <a href="${client.googleFormLink}">Click here to complete the questionnaire</a>
      <p>Thank you!</p>
    `;
    
    await sendEmail(email, emailSubject, emailHtml);
    
    res.status(201).json(client);
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Failed to create client' });
  }
});


// Get client by email
app.get('/api/clients/:email', async (req, res) => {
  try {
    const client = await Client.findOne({ email: req.params.email });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Check if we have questionnaire scores
    if (!client.questionnaireScores) {
      // Try to fetch from Google Sheets
      await checkGoogleFormResponse(client);
    }
    
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const clients = await Client.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});
app.get('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const client = await Client.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});
// Check for form responses
app.get('/api/clients/:id/check-responses', authenticateToken, async (req, res) => {
  // Add timeout handling
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Database operation timed out'));
    }, 8000); // Reject after 8 seconds
  });

  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    // Race the DB query against our timeout
    const client = await Promise.race([
      Client.findOne({ 
        _id: req.params.id, 
        createdBy: req.user.userId 
      }),
      timeoutPromise
    ]);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Get scores from Google Sheet with timeout
    const scores = await Promise.race([
      getScoresFromNewSheet(client.email),
      timeoutPromise
    ]);

    if (scores) {
      const updateOperation = Promise.race([
        Client.findByIdAndUpdate(
          req.params.id,
          { 
            questionnaireScores: scores,
            combinedScores: calculateCombinedScores(client.scriptScores, scores, client.weight)
          },
          { new: true }
        ),
        timeoutPromise
      ]);

      const updatedClient = await updateOperation;
      
      return res.json({ 
        updated: true,
        client: updatedClient
      });
    }
    
    res.json({ updated: false });
  } catch (err) {
    console.error('Error checking responses:', err.message);
    
    // Specific error messages
    if (err.message.includes('timed out')) {
      return res.status(504).json({ 
        error: 'Database timeout',
        message: 'The operation took too long to complete'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to check responses',
      details: err.message 
    });
  }
});
app.get('/health', async (req, res) => {
  try {
    // Simple ping to check if DB is responsive
    await mongoose.connection.db.admin().ping();
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date()
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});
// Helper function
function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
  if (!scriptScores || !questionnaireScores) return null;
  
  const combined = {};
  Object.keys(scriptScores).forEach(key => {
    const scriptValue = scriptScores[key] || 0;
    const questionnaireValue = questionnaireScores[key] || 0;
    combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
  });
  
  return combined;
}
// Update client (e.g., adjust weights)
// Make sure your client routes include proper authentication
app.put('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const { weight, scriptScores } = req.body;
    
    const client = await Client.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Get updated scores from Google Sheet
    const questionnaireScores = await getScoresFromNewSheet(client.email);
    
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
        weight,
        scriptScores,
        questionnaireScores,
        combinedScores: calculateCombinedScores(scriptScores, questionnaireScores, weight)
      },
      { new: true }
    );
    
    res.json(updatedClient);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ error: 'Failed to update client' });
  }
});
app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const client = await Client.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// Helper function to check Google Form responses
async function checkGoogleFormResponse(client) {
  try {
    const authClient = await auth.getClient();
    const spreadsheetId = '1XBLry0OaK5PPZbWJBaEPPI1_563WAkc8svQthekemUU';
    const range = 'Form Responses 2';
    
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) return;
    
    // Find the row with matching email
    const headers = rows[0];
    const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
    const timestampIndex = headers.findIndex(h => h.toLowerCase().includes('timestamp'));
    
    if (emailIndex === -1) return;
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[emailIndex] === client.email) {
        // Found the response - calculate scores
        const scores = calculateQuestionnaireScores(row, headers);
        
        // Update client record
        client.questionnaireScores = scores;
        client.googleFormResponseId = row[timestampIndex];
        client.combinedScores = calculateCombinedScores(
          client.scriptScores,
          scores,
          client.weight
        );
        
        await client.save();
        break;
      }
    }
  } catch (err) {
    console.error('Error checking Google Form responses:', err);
  }
}

// Helper function to calculate questionnaire scores from form responses
function calculateQuestionnaireScores(row, headers) {
  // This should implement your Excel sheet calculations
  // Here's a simplified example - adjust based on your actual calculations
  
  // Find indices of relevant questions
  const cumulativeIndices = [/* indices of cumulative questions */];
  const investigativeIndices = [/* indices of investigative questions */];
  const comprehensiveIndices = [/* indices of comprehensive questions */];
  const analyticalIndices = [/* indices of analytical questions */];
  
  // Calculate scores (this is simplified - use your actual calculation logic)
  const cumulativeScore = calculateSectionScore(row, cumulativeIndices);
  const investigativeScore = calculateSectionScore(row, investigativeIndices);
  const comprehensiveScore = calculateSectionScore(row, comprehensiveIndices);
  const analyticalScore = calculateSectionScore(row, analyticalIndices);
  
  return {
    Cumulative: cumulativeScore,
    Investigative: investigativeScore,
    Comprehensive: comprehensiveScore,
    Analytical: analyticalScore
  };
}

function calculateSectionScore(row, indices) {
  let total = 0;
  let count = 0;
  
  for (const index of indices) {
    if (row[index]) {
      total += parseInt(row[index]) || 0;
      count++;
    }
  }
  
  return count > 0 ? Math.round((total / (count * 5)) * 100) : 0; // Assuming 5-point scale
}

function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
  const combined = {};
  
  if (!scriptScores || !questionnaireScores) return null;
  
  Object.keys(scriptScores).forEach(key => {
    const scriptValue = scriptScores[key] || 0;
    const questionnaireValue = questionnaireScores[key] || 0;
    combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
  });
  
  return combined;
}
app.get('/test-new-sheet', async (req, res) => {
  try {
    const testEmail = 'test@example.com'; // Replace with an email from your sheet
    const scores = await getScoresFromNewSheet(testEmail);
    
    if (!scores) {
      return res.status(404).json({ error: 'No scores found for test email' });
    }
    
    res.json({
      success: true,
      message: 'Successfully connected to new Google Sheet',
      scores
    });
  } catch (err) {
    console.error('Test connection error:', err);
    res.status(500).json({
      error: 'Failed to connect to Google Sheet',
      details: err.message
    });
  }
});
// Add this endpoint to your server.js
app.post('/api/refresh-token', authenticateToken, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'user') {
      user = await User.findById(req.user.userId);
    } else if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.adminId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      req.user.role === 'user' 
        ? { userId: user._id, email: user.email, role: 'user' }
        : { adminId: user._id, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// //////////////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});