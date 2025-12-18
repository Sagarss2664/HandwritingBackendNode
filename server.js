

// // // // // //////////////////////////////////////////////////////////////////////////////////////////////

// // // // const PORT = process.env.PORT || 5000;
// // // // app.listen(PORT, () => {
// // // //   console.log(`Server running on port ${PORT}`);
// // // // });

// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const bcrypt = require('bcryptjs');
// // // const jwt = require('jsonwebtoken');
// // // const cors = require('cors');
// // // const nodemailer = require('nodemailer');
// // // const crypto = require('crypto');

// // // const app = express();

// // // // Middleware
// // // app.use(express.json());
// // // app.use(cors());

// // // // MongoDB Connection
// // // const mongoURI = 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/handwritting';
// // // mongoose.connect(mongoURI)
// // // .then(() => console.log('MongoDB connected'))
// // // .catch(err => console.error('MongoDB connection error:', err));


// // // const transporter = nodemailer.createTransport({
// // //   service: 'gmail',
// // //   auth: {
// // //     user: 'grapho.genius@gmail.com',
// // //     pass: 'gnzt pxuk uzyr klzj',
// // //   }
// // // });




// // // // User Schema
// // // const userSchema = new mongoose.Schema({
// // //   name: { type: String, required: true },
// // //   email: { type: String, required: true, unique: true },
// // //   mobile: { type: String, required: true },
// // //   role: { 
// // //     type: String, 
// // //     required: true,
// // //     enum: ['Graphologist', 'Hiring Manager', 'Psychiatrist', 'Other']
// // //   },
// // //   otherRole: { type: String },
// // //   password: { type: String },
// // //   isVerified: { type: Boolean, default: false },
// // //   verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
// // //   verifiedAt: { type: Date },
// // //   createdAt: { type: Date, default: Date.now },
// // //   lastLogin: { type: Date },
// // //   isActive: { type: Boolean, default: true }
// // // });

// // // // Admin Schema
// // // const adminSchema = new mongoose.Schema({
// // //   name: { type: String, required: true },
// // //   email: { type: String, required: true, unique: true },
// // //   mobile: { type: String, required: true },
// // //   password: { type: String, required: true },
// // //   department: { type: String },
// // //   isActive: { type: Boolean, default: true },
// // //   createdAt: { type: Date, default: Date.now },
// // //   lastLogin: { type: Date }
// // // });

// // // // User Activity Schema
// // // const userActivitySchema = new mongoose.Schema({
// // //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// // //   action: { type: String, required: true }, // login, logout, register, verify
// // //   timestamp: { type: Date, default: Date.now },
// // //   ipAddress: { type: String },
// // //   userAgent: { type: String }
// // // });

// // // const User = mongoose.model('User', userSchema);
// // // const Admin = mongoose.model('Admin', adminSchema);
// // // const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// // // // JWT Secret
// // // const JWT_SECRET = 'your-secret-key-here';

// // // // Middleware to verify JWT token
// // // const authenticateToken = (req, res, next) => {
// // //   const authHeader = req.headers['authorization'];
// // //   const token = authHeader && authHeader.split(' ')[1];

// // //   if (!token) {
// // //     return res.status(401).json({ error: 'Access token required' });
// // //   }

// // //   jwt.verify(token, JWT_SECRET, (err, decoded) => {
// // //     if (err) {
// // //       return res.status(403).json({ error: 'Invalid or expired token' });
// // //     }
// // //     req.user = decoded;
// // //     next();
// // //   });
// // // };

// // // // TEMPORARY: Create default admin (remove after use)
// // // app.get('/create-default-admin', async (req, res) => {
// // //   try {
// // //     const existing = await Admin.findOne({ email: 'admin@example.com' });
// // //     if (existing) return res.send('Admin already exists.');

// // //     const hashedPassword = await bcrypt.hash('admin123', 10); // default password
// // //     const admin = new Admin({
// // //       name: 'Super Admin',
// // //       email: 'admin@example.com',
// // //       mobile: '1234567890',
// // //       department: 'IT',
// // //       password: hashedPassword,
// // //       isActive: true,
// // //     });

// // //     await admin.save();
// // //     res.send('Default admin created. Use email: admin@example.com, password: admin123');
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).send('Error creating admin');
// // //   }
// // // });


// // // // Helper function to log user activity
// // // const logActivity = async (userId, action, req) => {
// // //   try {
// // //     await UserActivity.create({
// // //       userId,
// // //       action,
// // //       ipAddress: req.ip,
// // //       userAgent: req.get('User-Agent')
// // //     });
// // //   } catch (error) {
// // //     console.error('Error logging activity:', error);
// // //   }
// // // };

// // // // Helper function to send email
// // // const sendEmail = async (to, subject, html) => {
// // //   try {
// // //     await transporter.sendMail({
// // //       from: '"Grapho Genius" <grapho.genius@gmail.com>',
// // //       to,
// // //       subject,
// // //       html
// // //     });
// // //     console.log('Email sent successfully to:', to);
// // //   } catch (error) {
// // //     console.error('Error sending email:', error);
// // //   }
// // // };

// // // // Routes

// // // // User Registration
// // // app.post('/api/register', async (req, res) => {
// // //   try {
// // //     const { name, email, mobile, role, otherRole } = req.body;

// // //     // Check if user already exists
// // //     const existingUser = await User.findOne({ email });
// // //     if (existingUser) {
// // //       return res.status(400).json({ error: 'User already exists with this email' });
// // //     }

// // //     // Create new user
// // //     const user = new User({
// // //       name,
// // //       email,
// // //       mobile,
// // //       role,
// // //       otherRole: role === 'Other' ? otherRole : undefined
// // //     });

// // //     await user.save();
// // //     await logActivity(user._id, 'register', req);

// // //     // Send email to all admins
// // //     const admins = await Admin.find({ isActive: true });
// // //     const adminEmails = admins.map(admin => admin.email);

// // //     const emailSubject = 'New User Registration - Approval Required';
// // //     const emailHtml = `
// // //       <h2>New User Registration</h2>
// // //       <p>A new user has registered and requires approval:</p>
// // //       <ul>
// // //         <li><strong>Name:</strong> ${name}</li>
// // //         <li><strong>Email:</strong> ${email}</li>
// // //         <li><strong>Mobile:</strong> ${mobile}</li>
// // //         <li><strong>Role:</strong> ${role}${role === 'Other' ? ` (${otherRole})` : ''}</li>
// // //         <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
// // //       </ul>
// // //       <p>Please log in to the admin dashboard to approve or reject this user.</p>
// // //     `;

// // //     for (const adminEmail of adminEmails) {
// // //       await sendEmail(adminEmail, emailSubject, emailHtml);
// // //     }

// // //     res.status(201).json({ 
// // //       message: 'Registration successful. Please wait for admin approval.',
// // //       userId: user._id 
// // //     });
// // //   } catch (error) {
// // //     console.error('Registration error:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // User Login
// // // app.post('/api/user/login', async (req, res) => {
// // //   try {
// // //     const { email, password } = req.body;

// // //     const user = await User.findOne({ email });
// // //     if (!user || !user.isVerified) {
// // //       return res.status(401).json({ error: 'Invalid credentials or account not verified' });
// // //     }

// // //     const isValidPassword = await bcrypt.compare(password, user.password);
// // //     if (!isValidPassword) {
// // //       return res.status(401).json({ error: 'Invalid credentials' });
// // //     }

// // //     // Update last login
// // //     user.lastLogin = new Date();
// // //     await user.save();
// // //     await logActivity(user._id, 'login', req);

// // //     const token = jwt.sign(
// // //       { userId: user._id, email: user.email, role: 'user' },
// // //       JWT_SECRET,
// // //       { expiresIn: '24h' }
// // //     );

// // //     res.json({
// // //       token,
// // //       user: {
// // //         id: user._id,
// // //         name: user.name,
// // //         email: user.email,
// // //         role: user.role,
// // //         otherRole: user.otherRole
// // //       }
// // //     });
// // //   } catch (error) {
// // //     console.error('Login error:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // Admin Login
// // // app.post('/api/admin/login', async (req, res) => {
// // //   try {
// // //     const { email, password } = req.body;

// // //     const admin = await Admin.findOne({ email, isActive: true });
// // //     if (!admin) {
// // //       return res.status(401).json({ error: 'Invalid credentials' });
// // //     }

// // //     const isValidPassword = await bcrypt.compare(password, admin.password);
// // //     if (!isValidPassword) {
// // //       return res.status(401).json({ error: 'Invalid credentials' });
// // //     }

// // //     // Update last login
// // //     admin.lastLogin = new Date();
// // //     await admin.save();

// // //     const token = jwt.sign(
// // //       { adminId: admin._id, email: admin.email, role: 'admin' },
// // //       JWT_SECRET,
// // //       { expiresIn: '24h' }
// // //     );

// // //     res.json({
// // //       token,
// // //       admin: {
// // //         id: admin._id,
// // //         name: admin.name,
// // //         email: admin.email,
// // //         department: admin.department
// // //       }
// // //     });
// // //   } catch (error) {
// // //     console.error('Admin login error:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // Get pending user requests (Admin only)
// // // app.get('/api/admin/pending-users', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'admin') {
// // //       return res.status(403).json({ error: 'Admin access required' });
// // //     }

// // //     const pendingUsers = await User.find({ isVerified: false }).sort({ createdAt: -1 });
// // //     res.json(pendingUsers);
// // //   } catch (error) {
// // //     console.error('Error fetching pending users:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // Verify user (Admin only)
// // // app.post('/api/admin/verify-user/:userId', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'admin') {
// // //       return res.status(403).json({ error: 'Admin access required' });
// // //     }

// // //     const { userId } = req.params;
// // //     const user = await User.findById(userId);

// // //     if (!user) {
// // //       return res.status(404).json({ error: 'User not found' });
// // //     }

// // //     if (user.isVerified) {
// // //       return res.status(400).json({ error: 'User already verified' });
// // //     }

// // //     // Generate random password
// // //     const tempPassword = crypto.randomBytes(8).toString('hex');
// // //     const hashedPassword = await bcrypt.hash(tempPassword, 10);

// // //     // Update user
// // //     user.password = hashedPassword;
// // //     user.isVerified = true;
// // //     user.verifiedBy = req.user.adminId;
// // //     user.verifiedAt = new Date();
// // //     await user.save();

// // //     await logActivity(user._id, 'verify', req);

// // //     // Send email to user with credentials
// // //     const emailSubject = 'Account Approved - Login Credentials';
// // //     const emailHtml = `
// // //       <h2>Account Approved</h2>
// // //       <p>Dear ${user.name},</p>
// // //       <p>Your account has been approved by our admin team. You can now log in to the system using the following credentials:</p>
// // //       <ul>
// // //         <li><strong>Email:</strong> ${user.email}</li>
// // //         <li><strong>Password:</strong> ${tempPassword}</li>
// // //       </ul>
// // //       <p>Please log in and change your password for security purposes.</p>
// // //       <p>Welcome to the Handwritten Pattern Prediction System!</p>
// // //     `;

// // //     await sendEmail(user.email, emailSubject, emailHtml);

// // //     res.json({ message: 'User verified successfully and credentials sent via email' });
// // //   } catch (error) {
// // //     console.error('Error verifying user:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // Get all users (Admin only)
// // // app.get('/api/admin/users', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'admin') {
// // //       return res.status(403).json({ error: 'Admin access required' });
// // //     }

// // //     const users = await User.find()
// // //       .populate('verifiedBy', 'name email')
// // //       .sort({ createdAt: -1 });
    
// // //     res.json(users);
// // //   } catch (error) {
// // //     console.error('Error fetching users:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // Get user activities (Admin only)
// // // app.get('/api/admin/user-activities', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'admin') {
// // //       return res.status(403).json({ error: 'Admin access required' });
// // //     }

// // //     const activities = await UserActivity.find()
// // //       .populate('userId', 'name email')
// // //       .sort({ timestamp: -1 })
// // //       .limit(100);
    
// // //     res.json(activities);
// // //   } catch (error) {
// // //     console.error('Error fetching activities:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // User logout
// // // app.post('/api/user/logout', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role === 'user') {
// // //       await logActivity(req.user.userId, 'logout', req);
// // //     }
// // //     res.json({ message: 'Logged out successfully' });
// // //   } catch (error) {
// // //     console.error('Logout error:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // // Get user profile
// // // app.get('/api/user/profile', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     const user = await User.findById(req.user.userId).select('-password');
// // //     if (!user) {
// // //       return res.status(404).json({ error: 'User not found' });
// // //     }

// // //     res.json(user);
// // //   } catch (error) {
// // //     console.error('Error fetching profile:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });

// // // ///////////////////////////////////////////////////////////////////////////////////////////////

// // // // Define Client Schema
// // // const clientSchema = new mongoose.Schema({
// // //   name: { type: String, required: true },
// // //   email: { type: String, required: true },
// // //   googleFormLink: String,
// // //   googleFormResponseId: String,
// // //   questionnaireScores: {
// // //     Cumulative: Number,
// // //     Investigative: Number,
// // //     Comprehensive: Number,
// // //     Analytical: Number
// // //   },
// // //   scriptScores: Object,
// // //   combinedScores: Object,
// // //   weight: { type: Number, default: 50 },
// // //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// // //   createdAt: { type: Date, default: Date.now }
// // // });

// // // const Client = mongoose.model('Client', clientSchema);



// // // const { google } = require('googleapis');
// // // const sheets = google.sheets('v4');

// // // // Initialize auth with service account credentials
// // // // const auth = new google.auth.GoogleAuth({
// // // //   keyFile: 'googleSheetsAPI.json', // Your downloaded JSON file
// // // //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // // // });

// // // // const auth = new google.auth.GoogleAuth({
// // // //   keyFile: '/etc/secrets/googleSheetsAPI.json',
// // // //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // // // });
// // // const auth = new google.auth.GoogleAuth({
// // //   credentials: {
// // //     type: process.env.GOOGLE_TYPE,
// // //     project_id: process.env.GOOGLE_PROJECT_ID,
// // //     private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
// // //     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
// // //     client_email: process.env.GOOGLE_CLIENT_EMAIL,
// // //     client_id: process.env.GOOGLE_CLIENT_ID,
// // //     auth_uri: process.env.GOOGLE_AUTH_URI,
// // //     token_uri: process.env.GOOGLE_TOKEN_URI,
// // //     auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
// // //     client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
// // //     universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
// // //   },
// // //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // // });

// // // async function getScoresFromNewSheet(clientEmail) {
// // //   try {
// // //     const authClient = await auth.getClient();
// // //     const spreadsheetId = '1oYSj9bU3b5g-CzSCESbg8RAvuzj0dhXHdODRl_GhSno';
    
// // //     // First, list all available sheets
// // //     const spreadsheet = await sheets.spreadsheets.get({
// // //       auth: authClient,
// // //       spreadsheetId,
// // //     });

// // //     // Log all sheet names for debugging
// // //     const sheetNames = spreadsheet.data.sheets.map(s => s.properties.title);
// // //     console.log('Available sheets:', sheetNames);

// // //     // Find the correct sheet (case-insensitive match)
// // //     const targetSheet = spreadsheet.data.sheets.find(s => 
// // //       s.properties.title.toLowerCase().includes('form responses 2')
// // //     );

// // //     if (!targetSheet) {
// // //       console.error('No matching sheet found');
// // //       return null;
// // //     }

// // //     const sheetName = targetSheet.properties.title;
// // //     console.log(`Using sheet: ${sheetName}`);

// // //     // Get all data from the sheet (extended range to include all columns)
// // //     const response = await sheets.spreadsheets.values.get({
// // //       auth: authClient,
// // //       spreadsheetId,
// // //       range: `${sheetName}!A:BJ`, // Extended range to include all columns
// // //     });

// // //     const rows = response.data.values;
// // //     if (!rows || rows.length === 0) {
// // //       console.log('No data found in sheet');
// // //       return null;
// // //     }

// // //     // Log first row headers for verification
// // //     console.log('Headers:', rows[0]);

// // //     // Find column indexes dynamically based on headers
// // //     const headers = rows[0].map(h => h.toString().toLowerCase());
    
// // //     // Email is in column C (index 2)
// // //     const emailColIndex = 2;
    
// // //     // Find score columns (note the typo in "Comphrehensive")
// // //     const cumulativeColIndex = headers.findIndex(h => h.includes('cumulative %'));
// // //     const comprehensiveColIndex = headers.findIndex(h => h.includes('comphrehensive %')); // Note the typo
// // //     const investigativeColIndex = headers.findIndex(h => h.includes('investigative %'));
// // //     const analyticalColIndex = headers.findIndex(h => h.includes('analytical %'));

// // //     console.log('Found columns:', {
// // //       email: emailColIndex,
// // //       cumulative: cumulativeColIndex,
// // //       comprehensive: comprehensiveColIndex,
// // //       investigative: investigativeColIndex,
// // //       analytical: analyticalColIndex
// // //     });

// // //     // Verify we found all required columns
// // //     if (cumulativeColIndex === -1 || comprehensiveColIndex === -1 || 
// // //         investigativeColIndex === -1 || analyticalColIndex === -1) {
// // //       console.error('Missing required score columns');
// // //       return null;
// // //     }

// // //     // Find the row with matching email
// // //     for (let i = 1; i < rows.length; i++) {
// // //       const row = rows[i];
// // //       if (row[emailColIndex] && 
// // //           row[emailColIndex].toString().trim().toLowerCase() === clientEmail.trim().toLowerCase()) {
// // //         console.log('Found matching row:', row);
        
// // //         // Extract and parse scores
// // //         return {
// // //           Cumulative: parseFloat(row[cumulativeColIndex]) || 0,
// // //           Comprehensive: parseFloat(row[comprehensiveColIndex]) || 0,
// // //           Investigative: parseFloat(row[investigativeColIndex]) || 0,
// // //           Analytical: parseFloat(row[analyticalColIndex]) || 0
// // //         };
// // //       }
// // //     }

// // //     console.log(`No row found for email: ${clientEmail}`);
// // //     return null;
// // //   } catch (err) {
// // //     console.error('Google Sheets API error:', err.message);
// // //     if (err.response) {
// // //       console.error('API response error:', JSON.stringify(err.response.data, null, 2));
// // //     }
// // //     return null;
// // //   }
// // // }
// // // app.get('/test-sheet', async (req, res) => {
// // //   try {
// // //     const testEmail = 'test@example.com'; // Replace with actual email from sheet
// // //     const scores = await getScoresFromNewSheet(testEmail);
    
// // //     if (!scores) {
// // //       return res.status(404).json({ 
// // //         error: 'No scores found',
// // //         message: 'Make sure the email exists in the sheet and columns are correct'
// // //       });
// // //     }
    
// // //     res.json({
// // //       success: true,
// // //       message: 'Successfully fetched scores from Google Sheet',
// // //       scores
// // //     });
// // //   } catch (err) {
// // //     res.status(500).json({
// // //       error: 'Failed to fetch scores',
// // //       details: err.message
// // //     });
// // //   }
// // // });

// // // app.get('/test-sheet-connection', async (req, res) => {
// // //   try {
// // //     const testEmail = 'test@example.com'; // Replace with an email from your sheet
// // //     const scores = await getScoresFromNewSheet(testEmail);
    
// // //     if (!scores) {
// // //       return res.status(404).json({ error: 'No scores found for test email' });
// // //     }
    
// // //     res.json({
// // //       success: true,
// // //       message: 'Successfully connected to Google Sheets',
// // //       scores
// // //     });
// // //   } catch (err) {
// // //     console.error('Test connection error:', err);
// // //     res.status(500).json({
// // //       error: 'Failed to connect to Google Sheets',
// // //       details: err.message
// // //     });
// // //   }
// // // });

// // // app.post('/api/clients', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     const { name, email } = req.body;
    
// // //     const client = new Client({
// // //       name,
// // //       email,
// // //       googleFormLink: `https://docs.google.com/forms/d/e/1FAIpQLScVX1hndMaUFpQgPjG2EXcCimYhMTFNR-8t5QdVV1kr9flNAQ/viewform?usp=pp_url&entry.1234567890=${encodeURIComponent(email)}`,
// // //       createdBy: req.user.userId
// // //     });
    
// // //     await client.save();
    
// // //     // Send email to client
// // //     const emailSubject = 'Please complete your handwriting analysis questionnaire';
// // //     const emailHtml = `
// // //       <p>Dear ${name},</p>
// // //       <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
// // //       <a href="${client.googleFormLink}">Click here to complete the questionnaire</a>
// // //       <p>Thank you!</p>
// // //     `;
    
// // //     await sendEmail(email, emailSubject, emailHtml);
    
// // //     res.status(201).json(client);
// // //   } catch (err) {
// // //     console.error('Error creating client:', err);
// // //     res.status(500).json({ error: 'Failed to create client' });
// // //   }
// // // });


// // // // Get client by email
// // // app.get('/api/clients/:email', async (req, res) => {
// // //   try {
// // //     const client = await Client.findOne({ email: req.params.email });
    
// // //     if (!client) {
// // //       return res.status(404).json({ error: 'Client not found' });
// // //     }
    
// // //     // Check if we have questionnaire scores
// // //     if (!client.questionnaireScores) {
// // //       // Try to fetch from Google Sheets
// // //       await checkGoogleFormResponse(client);
// // //     }
    
// // //     res.json(client);
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: 'Failed to fetch client' });
// // //   }
// // // });
// // // app.get('/api/clients', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     const clients = await Client.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
// // //     res.json(clients);
// // //   } catch (err) {
// // //     console.error('Error fetching clients:', err);
// // //     res.status(500).json({ error: 'Failed to fetch clients' });
// // //   }
// // // });
// // // app.get('/api/clients/:id', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     const client = await Client.findOne({ 
// // //       _id: req.params.id, 
// // //       createdBy: req.user.userId 
// // //     });
    
// // //     if (!client) {
// // //       return res.status(404).json({ error: 'Client not found' });
// // //     }
    
// // //     res.json(client);
// // //   } catch (err) {
// // //     console.error('Error fetching client:', err);
// // //     res.status(500).json({ error: 'Failed to fetch client' });
// // //   }
// // // });
// // // // Check for form responses
// // // app.get('/api/clients/:id/check-responses', authenticateToken, async (req, res) => {
// // //   // Add timeout handling
// // //   const timeoutPromise = new Promise((_, reject) => {
// // //     setTimeout(() => {
// // //       reject(new Error('Database operation timed out'));
// // //     }, 8000); // Reject after 8 seconds
// // //   });

// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     // Race the DB query against our timeout
// // //     const client = await Promise.race([
// // //       Client.findOne({ 
// // //         _id: req.params.id, 
// // //         createdBy: req.user.userId 
// // //       }),
// // //       timeoutPromise
// // //     ]);

// // //     if (!client) {
// // //       return res.status(404).json({ error: 'Client not found' });
// // //     }

// // //     // Get scores from Google Sheet with timeout
// // //     const scores = await Promise.race([
// // //       getScoresFromNewSheet(client.email),
// // //       timeoutPromise
// // //     ]);

// // //     if (scores) {
// // //       const updateOperation = Promise.race([
// // //         Client.findByIdAndUpdate(
// // //           req.params.id,
// // //           { 
// // //             questionnaireScores: scores,
// // //             combinedScores: calculateCombinedScores(client.scriptScores, scores, client.weight)
// // //           },
// // //           { new: true }
// // //         ),
// // //         timeoutPromise
// // //       ]);

// // //       const updatedClient = await updateOperation;
      
// // //       return res.json({ 
// // //         updated: true,
// // //         client: updatedClient
// // //       });
// // //     }
    
// // //     res.json({ updated: false });
// // //   } catch (err) {
// // //     console.error('Error checking responses:', err.message);
    
// // //     // Specific error messages
// // //     if (err.message.includes('timed out')) {
// // //       return res.status(504).json({ 
// // //         error: 'Database timeout',
// // //         message: 'The operation took too long to complete'
// // //       });
// // //     }
    
// // //     res.status(500).json({ 
// // //       error: 'Failed to check responses',
// // //       details: err.message 
// // //     });
// // //   }
// // // });
// // // app.get('/health', async (req, res) => {
// // //   try {
// // //     // Simple ping to check if DB is responsive
// // //     await mongoose.connection.db.admin().ping();
// // //     res.json({
// // //       status: 'healthy',
// // //       database: 'connected',
// // //       timestamp: new Date()
// // //     });
// // //   } catch (err) {
// // //     res.status(503).json({
// // //       status: 'unhealthy',
// // //       database: 'disconnected',
// // //       error: err.message
// // //     });
// // //   }
// // // });
// // // // Helper function
// // // function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
// // //   if (!scriptScores || !questionnaireScores) return null;
  
// // //   const combined = {};
// // //   Object.keys(scriptScores).forEach(key => {
// // //     const scriptValue = scriptScores[key] || 0;
// // //     const questionnaireValue = questionnaireScores[key] || 0;
// // //     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
// // //   });
  
// // //   return combined;
// // // }
// // // // Update client (e.g., adjust weights)
// // // // Make sure your client routes include proper authentication
// // // app.put('/api/clients/:id', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     const { weight, scriptScores } = req.body;
    
// // //     const client = await Client.findOne({ 
// // //       _id: req.params.id, 
// // //       createdBy: req.user.userId 
// // //     });
    
// // //     if (!client) {
// // //       return res.status(404).json({ error: 'Client not found' });
// // //     }

// // //     // Get updated scores from Google Sheet
// // //     const questionnaireScores = await getScoresFromNewSheet(client.email);
    
// // //     const updatedClient = await Client.findByIdAndUpdate(
// // //       req.params.id,
// // //       {
// // //         weight,
// // //         scriptScores,
// // //         questionnaireScores,
// // //         combinedScores: calculateCombinedScores(scriptScores, questionnaireScores, weight)
// // //       },
// // //       { new: true }
// // //     );
    
// // //     res.json(updatedClient);
// // //   } catch (err) {
// // //     console.error('Error updating client:', err);
// // //     res.status(500).json({ error: 'Failed to update client' });
// // //   }
// // // });
// // // app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     const client = await Client.findOneAndDelete({ 
// // //       _id: req.params.id, 
// // //       createdBy: req.user.userId 
// // //     });
    
// // //     if (!client) {
// // //       return res.status(404).json({ error: 'Client not found' });
// // //     }
    
// // //     res.json({ message: 'Client deleted successfully' });
// // //   } catch (err) {
// // //     console.error('Error deleting client:', err);
// // //     res.status(500).json({ error: 'Failed to delete client' });
// // //   }
// // // });

// // // // Helper function to check Google Form responses
// // // async function checkGoogleFormResponse(client) {
// // //   try {
// // //     const authClient = await auth.getClient();
// // //     const spreadsheetId = '1XBLry0OaK5PPZbWJBaEPPI1_563WAkc8svQthekemUU';
// // //     const range = 'Form Responses 2';
    
// // //     const response = await sheets.spreadsheets.values.get({
// // //       auth: authClient,
// // //       spreadsheetId,
// // //       range,
// // //     });
    
// // //     const rows = response.data.values;
// // //     if (!rows || rows.length === 0) return;
    
// // //     // Find the row with matching email
// // //     const headers = rows[0];
// // //     const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
// // //     const timestampIndex = headers.findIndex(h => h.toLowerCase().includes('timestamp'));
    
// // //     if (emailIndex === -1) return;
    
// // //     for (let i = 1; i < rows.length; i++) {
// // //       const row = rows[i];
// // //       if (row[emailIndex] === client.email) {
// // //         // Found the response - calculate scores
// // //         const scores = calculateQuestionnaireScores(row, headers);
        
// // //         // Update client record
// // //         client.questionnaireScores = scores;
// // //         client.googleFormResponseId = row[timestampIndex];
// // //         client.combinedScores = calculateCombinedScores(
// // //           client.scriptScores,
// // //           scores,
// // //           client.weight
// // //         );
        
// // //         await client.save();
// // //         break;
// // //       }
// // //     }
// // //   } catch (err) {
// // //     console.error('Error checking Google Form responses:', err);
// // //   }
// // // }

// // // // Helper function to calculate questionnaire scores from form responses
// // // function calculateQuestionnaireScores(row, headers) {
// // //   // This should implement your Excel sheet calculations
// // //   // Here's a simplified example - adjust based on your actual calculations
  
// // //   // Find indices of relevant questions
// // //   const cumulativeIndices = [/* indices of cumulative questions */];
// // //   const investigativeIndices = [/* indices of investigative questions */];
// // //   const comprehensiveIndices = [/* indices of comprehensive questions */];
// // //   const analyticalIndices = [/* indices of analytical questions */];
  
// // //   // Calculate scores (this is simplified - use your actual calculation logic)
// // //   const cumulativeScore = calculateSectionScore(row, cumulativeIndices);
// // //   const investigativeScore = calculateSectionScore(row, investigativeIndices);
// // //   const comprehensiveScore = calculateSectionScore(row, comprehensiveIndices);
// // //   const analyticalScore = calculateSectionScore(row, analyticalIndices);
  
// // //   return {
// // //     Cumulative: cumulativeScore,
// // //     Investigative: investigativeScore,
// // //     Comprehensive: comprehensiveScore,
// // //     Analytical: analyticalScore
// // //   };
// // // }

// // // function calculateSectionScore(row, indices) {
// // //   let total = 0;
// // //   let count = 0;
  
// // //   for (const index of indices) {
// // //     if (row[index]) {
// // //       total += parseInt(row[index]) || 0;
// // //       count++;
// // //     }
// // //   }
  
// // //   return count > 0 ? Math.round((total / (count * 5)) * 100) : 0; // Assuming 5-point scale
// // // }

// // // function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
// // //   const combined = {};
  
// // //   if (!scriptScores || !questionnaireScores) return null;
  
// // //   Object.keys(scriptScores).forEach(key => {
// // //     const scriptValue = scriptScores[key] || 0;
// // //     const questionnaireValue = questionnaireScores[key] || 0;
// // //     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
// // //   });
  
// // //   return combined;
// // // }
// // // app.get('/test-new-sheet', async (req, res) => {
// // //   try {
// // //     const testEmail = 'test@example.com'; // Replace with an email from your sheet
// // //     const scores = await getScoresFromNewSheet(testEmail);
    
// // //     if (!scores) {
// // //       return res.status(404).json({ error: 'No scores found for test email' });
// // //     }
    
// // //     res.json({
// // //       success: true,
// // //       message: 'Successfully connected to new Google Sheet',
// // //       scores
// // //     });
// // //   } catch (err) {
// // //     console.error('Test connection error:', err);
// // //     res.status(500).json({
// // //       error: 'Failed to connect to Google Sheet',
// // //       details: err.message
// // //     });
// // //   }
// // // });
// // // // Add this endpoint to your server.js
// // // app.post('/api/refresh-token', authenticateToken, async (req, res) => {
// // //   try {
// // //     let user;
// // //     if (req.user.role === 'user') {
// // //       user = await User.findById(req.user.userId);
// // //     } else if (req.user.role === 'admin') {
// // //       user = await Admin.findById(req.user.adminId);
// // //     }

// // //     if (!user) {
// // //       return res.status(404).json({ error: 'User not found' });
// // //     }

// // //     const token = jwt.sign(
// // //       req.user.role === 'user' 
// // //         ? { userId: user._id, email: user.email, role: 'user' }
// // //         : { adminId: user._id, email: user.email, role: 'admin' },
// // //       JWT_SECRET,
// // //       { expiresIn: '24h' }
// // //     );

// // //     res.json({ token });
// // //   } catch (error) {
// // //     console.error('Token refresh error:', error);
// // //     res.status(500).json({ error: 'Failed to refresh token' });
// // //   }
// // // });
// // // // Send form to client
// // // app.post('/api/clients/send-form', authenticateToken, async (req, res) => {
// // //   try {
// // //     if (req.user.role !== 'user') {
// // //       return res.status(403).json({ error: 'User access required' });
// // //     }

// // //     const { clientId } = req.body;
    
// // //     const client = await Client.findOne({ 
// // //       _id: clientId, 
// // //       createdBy: req.user.userId 
// // //     });
    
// // //     if (!client) {
// // //       return res.status(404).json({ error: 'Client not found' });
// // //     }

// // //     // Send email to client with the form link
// // //     const emailSubject = 'Please complete your handwriting analysis questionnaire';
// // //     const emailHtml = `
// // //       <p>Dear ${client.name},</p>
// // //       <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
// // //       <a href="${client.googleFormLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Click here to complete the questionnaire</a>
// // //       <p><strong>Link:</strong> ${client.googleFormLink}</p>
// // //       <p>Thank you!</p>
// // //     `;
    
// // //     await sendEmail(client.email, emailSubject, emailHtml);
    
// // //     res.json({ 
// // //       message: 'Form sent successfully to client',
// // //       client: {
// // //         id: client._id,
// // //         name: client.name,
// // //         email: client.email
// // //       }
// // //     });
// // //   } catch (err) {
// // //     console.error('Error sending form:', err);
// // //     res.status(500).json({ error: 'Failed to send form to client' });
// // //   }
// // // });
// // // // //////////////////////////////////////////////////////////////////////////////////////////////

// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => {
// // //   console.log(`Server running on port ${PORT}`);
// // // });

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const cors = require('cors');
// // const nodemailer = require('nodemailer');
// // const crypto = require('crypto');

// // const app = express();

// // // Middleware
// // app.use(express.json());
// // app.use(cors());

// // // MongoDB Connection
// // const mongoURI = process.env.MONGO_URI;
// // mongoose.connect(mongoURI)
// // .then(() => console.log('MongoDB connected'))
// // .catch(err => console.error('MongoDB connection error:', err));


// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: 'grapho.genius@gmail.com',
// //     pass: process.env.EMAIL_PWD,
// //   }
// // });




// // // User Schema
// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   mobile: { type: String, required: true },
// //   role: { 
// //     type: String, 
// //     required: true,
// //     enum: ['Graphologist', 'Hiring Manager', 'Psychiatrist', 'Other']
// //   },
// //   otherRole: { type: String },
// //   password: { type: String },
// //   isVerified: { type: Boolean, default: false },
// //   verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
// //   verifiedAt: { type: Date },
// //   createdAt: { type: Date, default: Date.now },
// //   lastLogin: { type: Date },
// //   isActive: { type: Boolean, default: true }
// // });

// // // Admin Schema
// // const adminSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   mobile: { type: String, required: true },
// //   password: { type: String, required: true },
// //   department: { type: String },
// //   isActive: { type: Boolean, default: true },
// //   createdAt: { type: Date, default: Date.now },
// //   lastLogin: { type: Date }
// // });

// // // User Activity Schema
// // const userActivitySchema = new mongoose.Schema({
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// //   action: { type: String, required: true }, // login, logout, register, verify
// //   timestamp: { type: Date, default: Date.now },
// //   ipAddress: { type: String },
// //   userAgent: { type: String }
// // });

// // const User = mongoose.model('User', userSchema);
// // const Admin = mongoose.model('Admin', adminSchema);
// // const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// // // JWT Secret
// // const JWT_SECRET = 'your-secret-key-here';

// // // Middleware to verify JWT token
// // const authenticateToken = (req, res, next) => {
// //   const authHeader = req.headers['authorization'];
// //   const token = authHeader && authHeader.split(' ')[1];

// //   if (!token) {
// //     return res.status(401).json({ error: 'Access token required' });
// //   }

// //   jwt.verify(token, JWT_SECRET, (err, decoded) => {
// //     if (err) {
// //       return res.status(403).json({ error: 'Invalid or expired token' });
// //     }
// //     req.user = decoded;
// //     next();
// //   });
// // };

// // // TEMPORARY: Create default admin (remove after use)
// // app.get('/create-default-admin', async (req, res) => {
// //   try {
// //     const existing = await Admin.findOne({ email: 'admin@example.com' });
// //     if (existing) return res.send('Admin already exists.');

// //     const hashedPassword = await bcrypt.hash('admin123', 10); // default password
// //     const admin = new Admin({
// //       name: 'Super Admin',
// //       email: 'admin@example.com',
// //       mobile: '1234567890',
// //       department: 'IT',
// //       password: hashedPassword,
// //       isActive: true,
// //     });

// //     await admin.save();
// //     res.send('Default admin created. Use email: admin@example.com, password: admin123');
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send('Error creating admin');
// //   }
// // });


// // // Helper function to log user activity
// // const logActivity = async (userId, action, req) => {
// //   try {
// //     await UserActivity.create({
// //       userId,
// //       action,
// //       ipAddress: req.ip,
// //       userAgent: req.get('User-Agent')
// //     });
// //   } catch (error) {
// //     console.error('Error logging activity:', error);
// //   }
// // };

// // // Helper function to send email
// // const sendEmail = async (to, subject, html) => {
// //   try {
// //     await transporter.sendMail({
// //       from: '"Grapho Genius" <grapho.genius@gmail.com>',
// //       to,
// //       subject,
// //       html
// //     });
// //     console.log('Email sent successfully to:', to);
// //   } catch (error) {
// //     console.error('Error sending email:', error);
// //   }
// // };

// // // Routes

// // // User Registration
// // app.post('/api/register', async (req, res) => {
// //   try {
// //     const { name, email, mobile, role, otherRole } = req.body;

// //     // Check if user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ error: 'User already exists with this email' });
// //     }

// //     // Create new user
// //     const user = new User({
// //       name,
// //       email,
// //       mobile,
// //       role,
// //       otherRole: role === 'Other' ? otherRole : undefined
// //     });

// //     await user.save();
// //     await logActivity(user._id, 'register', req);

// //     // Send email to all admins
// //     const admins = await Admin.find({ isActive: true });
// //     const adminEmails = admins.map(admin => admin.email);

// //     const emailSubject = 'New User Registration - Approval Required';
// //     const emailHtml = `
// //       <h2>New User Registration</h2>
// //       <p>A new user has registered and requires approval:</p>
// //       <ul>
// //         <li><strong>Name:</strong> ${name}</li>
// //         <li><strong>Email:</strong> ${email}</li>
// //         <li><strong>Mobile:</strong> ${mobile}</li>
// //         <li><strong>Role:</strong> ${role}${role === 'Other' ? ` (${otherRole})` : ''}</li>
// //         <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
// //       </ul>
// //       <p>Please log in to the admin dashboard to approve or reject this user.</p>
// //     `;

// //     for (const adminEmail of adminEmails) {
// //       await sendEmail(adminEmail, emailSubject, emailHtml);
// //     }

// //     res.status(201).json({ 
// //       message: 'Registration successful. Please wait for admin approval.',
// //       userId: user._id 
// //     });
// //   } catch (error) {
// //     console.error('Registration error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // User Login
// // app.post('/api/user/login', async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user || !user.isVerified) {
// //       return res.status(401).json({ error: 'Invalid credentials or account not verified' });
// //     }

// //     const isValidPassword = await bcrypt.compare(password, user.password);
// //     if (!isValidPassword) {
// //       return res.status(401).json({ error: 'Invalid credentials' });
// //     }

// //     // Update last login
// //     user.lastLogin = new Date();
// //     await user.save();
// //     await logActivity(user._id, 'login', req);

// //     const token = jwt.sign(
// //       { userId: user._id, email: user.email, role: 'user' },
// //       JWT_SECRET,
// //       { expiresIn: '24h' }
// //     );

// //     res.json({
// //       token,
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         role: user.role,
// //         otherRole: user.otherRole
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Admin Login
// // app.post('/api/admin/login', async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const admin = await Admin.findOne({ email, isActive: true });
// //     if (!admin) {
// //       return res.status(401).json({ error: 'Invalid credentials' });
// //     }

// //     const isValidPassword = await bcrypt.compare(password, admin.password);
// //     if (!isValidPassword) {
// //       return res.status(401).json({ error: 'Invalid credentials' });
// //     }

// //     // Update last login
// //     admin.lastLogin = new Date();
// //     await admin.save();

// //     const token = jwt.sign(
// //       { adminId: admin._id, email: admin.email, role: 'admin' },
// //       JWT_SECRET,
// //       { expiresIn: '24h' }
// //     );

// //     res.json({
// //       token,
// //       admin: {
// //         id: admin._id,
// //         name: admin.name,
// //         email: admin.email,
// //         department: admin.department
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Admin login error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get pending user requests (Admin only)
// // app.get('/api/admin/pending-users', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'admin') {
// //       return res.status(403).json({ error: 'Admin access required' });
// //     }

// //     const pendingUsers = await User.find({ isVerified: false }).sort({ createdAt: -1 });
// //     res.json(pendingUsers);
// //   } catch (error) {
// //     console.error('Error fetching pending users:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Verify user (Admin only)
// // app.post('/api/admin/verify-user/:userId', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'admin') {
// //       return res.status(403).json({ error: 'Admin access required' });
// //     }

// //     const { userId } = req.params;
// //     const user = await User.findById(userId);

// //     if (!user) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }

// //     if (user.isVerified) {
// //       return res.status(400).json({ error: 'User already verified' });
// //     }

// //     // Generate random password
// //     const tempPassword = crypto.randomBytes(8).toString('hex');
// //     const hashedPassword = await bcrypt.hash(tempPassword, 10);

// //     // Update user
// //     user.password = hashedPassword;
// //     user.isVerified = true;
// //     user.verifiedBy = req.user.adminId;
// //     user.verifiedAt = new Date();
// //     await user.save();

// //     await logActivity(user._id, 'verify', req);

// //     // Send email to user with credentials
// //     const emailSubject = 'Account Approved - Login Credentials';
// //     const emailHtml = `
// //       <h2>Account Approved</h2>
// //       <p>Dear ${user.name},</p>
// //       <p>Your account has been approved by our admin team. You can now log in to the system using the following credentials:</p>
// //       <ul>
// //         <li><strong>Email:</strong> ${user.email}</li>
// //         <li><strong>Password:</strong> ${tempPassword}</li>
// //       </ul>
// //       <p>Please log in and change your password for security purposes.</p>
// //       <p>Welcome to the Handwritten Pattern Prediction System!</p>
// //     `;

// //     await sendEmail(user.email, emailSubject, emailHtml);

// //     res.json({ message: 'User verified successfully and credentials sent via email' });
// //   } catch (error) {
// //     console.error('Error verifying user:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get all users (Admin only)
// // app.get('/api/admin/users', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'admin') {
// //       return res.status(403).json({ error: 'Admin access required' });
// //     }

// //     const users = await User.find()
// //       .populate('verifiedBy', 'name email')
// //       .sort({ createdAt: -1 });
    
// //     res.json(users);
// //   } catch (error) {
// //     console.error('Error fetching users:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get user activities (Admin only)
// // app.get('/api/admin/user-activities', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'admin') {
// //       return res.status(403).json({ error: 'Admin access required' });
// //     }

// //     const activities = await UserActivity.find()
// //       .populate('userId', 'name email')
// //       .sort({ timestamp: -1 })
// //       .limit(100);
    
// //     res.json(activities);
// //   } catch (error) {
// //     console.error('Error fetching activities:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // User logout
// // app.post('/api/user/logout', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role === 'user') {
// //       await logActivity(req.user.userId, 'logout', req);
// //     }
// //     res.json({ message: 'Logged out successfully' });
// //   } catch (error) {
// //     console.error('Logout error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get user profile
// // app.get('/api/user/profile', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'user') {
// //       return res.status(403).json({ error: 'User access required' });
// //     }

// //     const user = await User.findById(req.user.userId).select('-password');
// //     if (!user) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }

// //     res.json(user);
// //   } catch (error) {
// //     console.error('Error fetching profile:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // ///////////////////////////////////////////////////////////////////////////////////////////////

// // // Define Client Schema
// // const clientSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true },
// //   googleFormLink: String,
// //   googleFormResponseId: String,
// //   questionnaireScores: {
// //     Cumulative: Number,
// //     Investigative: Number,
// //     Comprehensive: Number,
// //     Analytical: Number
// //   },
// //   scriptScores: Object,
// //   combinedScores: Object,
// //   weight: { type: Number, default: 50 },
// //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// //   createdAt: { type: Date, default: Date.now }
// // });

// // const Client = mongoose.model('Client', clientSchema);



// // const { google } = require('googleapis');
// // const sheets = google.sheets('v4');


// // const auth = new google.auth.GoogleAuth({
// //   credentials: {
// //     type: process.env.GOOGLE_TYPE,
// //     project_id: process.env.GOOGLE_PROJECT_ID,
// //     private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
// //     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
// //     client_email: process.env.GOOGLE_CLIENT_EMAIL,
// //     client_id: process.env.GOOGLE_CLIENT_ID,
// //     auth_uri: process.env.GOOGLE_AUTH_URI,
// //     token_uri: process.env.GOOGLE_TOKEN_URI,
// //     auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
// //     client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
// //     universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
// //   },
// //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // });
// // async function getScoresFromNewSheet(clientEmail) {
// //   try {
// //     const authClient = await auth.getClient();
// //     const spreadsheetId = process.env.SPREDSHEET_ID;
    
// //     // First, list all available sheets
// //     const spreadsheet = await sheets.spreadsheets.get({
// //       auth: authClient,
// //       spreadsheetId,
// //     });

// //     // Log all sheet names for debugging
// //     const sheetNames = spreadsheet.data.sheets.map(s => s.properties.title);
// //     console.log('Available sheets:', sheetNames);

// //     // Find the correct sheet (case-insensitive match)
// //     const targetSheet = spreadsheet.data.sheets.find(s => 
// //       s.properties.title.toLowerCase().includes('form responses 2')
// //     );

// //     if (!targetSheet) {
// //       console.error('No matching sheet found');
// //       return null;
// //     }

// //     const sheetName = targetSheet.properties.title;
// //     console.log(`Using sheet: ${sheetName}`);

// //     // Get all data from the sheet (extended range to include all columns)
// //     const response = await sheets.spreadsheets.values.get({
// //       auth: authClient,
// //       spreadsheetId,
// //       range: `${sheetName}!A:BJ`, // Extended range to include all columns
// //     });

// //     const rows = response.data.values;
// //     if (!rows || rows.length === 0) {
// //       console.log('No data found in sheet');
// //       return null;
// //     }

// //     // Log first row headers for verification
// //     console.log('Headers:', rows[0]);

// //     // Find column indexes dynamically based on headers
// //     const headers = rows[0].map(h => h.toString().toLowerCase());
    
// //     // Email is in column C (index 2)
// //     const emailColIndex = 2;
    
// //     // Find score columns (note the typo in "Comphrehensive")
// //     const cumulativeColIndex = headers.findIndex(h => h.includes('cumulative %'));
// //     const comprehensiveColIndex = headers.findIndex(h => h.includes('comphrehensive %')); // Note the typo
// //     const investigativeColIndex = headers.findIndex(h => h.includes('investigative %'));
// //     const analyticalColIndex = headers.findIndex(h => h.includes('analytical %'));

// //     console.log('Found columns:', {
// //       email: emailColIndex,
// //       cumulative: cumulativeColIndex,
// //       comprehensive: comprehensiveColIndex,
// //       investigative: investigativeColIndex,
// //       analytical: analyticalColIndex
// //     });

// //     // Verify we found all required columns
// //     if (cumulativeColIndex === -1 || comprehensiveColIndex === -1 || 
// //         investigativeColIndex === -1 || analyticalColIndex === -1) {
// //       console.error('Missing required score columns');
// //       return null;
// //     }

// //     // Find the row with matching email
// //     for (let i = 1; i < rows.length; i++) {
// //       const row = rows[i];
// //       if (row[emailColIndex] && 
// //           row[emailColIndex].toString().trim().toLowerCase() === clientEmail.trim().toLowerCase()) {
// //         console.log('Found matching row:', row);
        
// //         // Extract and parse scores
// //         return {
// //           Cumulative: parseFloat(row[cumulativeColIndex]) || 0,
// //           Comprehensive: parseFloat(row[comprehensiveColIndex]) || 0,
// //           Investigative: parseFloat(row[investigativeColIndex]) || 0,
// //           Analytical: parseFloat(row[analyticalColIndex]) || 0
// //         };
// //       }
// //     }

// //     console.log(`No row found for email: ${clientEmail}`);
// //     return null;
// //   } catch (err) {
// //     console.error('Google Sheets API error:', err.message);
// //     if (err.response) {
// //       console.error('API response error:', JSON.stringify(err.response.data, null, 2));
// //     }
// //     return null;
// //   }
// // }
// // app.get('/test-sheet', async (req, res) => {
// //   try {
// //     const testEmail = 'test@example.com'; // Replace with actual email from sheet
// //     const scores = await getScoresFromNewSheet(testEmail);
    
// //     if (!scores) {
// //       return res.status(404).json({ 
// //         error: 'No scores found',
// //         message: 'Make sure the email exists in the sheet and columns are correct'
// //       });
// //     }
    
// //     res.json({
// //       success: true,
// //       message: 'Successfully fetched scores from Google Sheet',
// //       scores
// //     });
// //   } catch (err) {
// //     res.status(500).json({
// //       error: 'Failed to fetch scores',
// //       details: err.message
// //     });
// //   }
// // });

// // app.get('/test-sheet-connection', async (req, res) => {
// //   try {
// //     const testEmail = 'test@example.com'; // Replace with an email from your sheet
// //     const scores = await getScoresFromNewSheet(testEmail);
    
// //     if (!scores) {
// //       return res.status(404).json({ error: 'No scores found for test email' });
// //     }
    
// //     res.json({
// //       success: true,
// //       message: 'Successfully connected to Google Sheets',
// //       scores
// //     });
// //   } catch (err) {
// //     console.error('Test connection error:', err);
// //     res.status(500).json({
// //       error: 'Failed to connect to Google Sheets',
// //       details: err.message
// //     });
// //   }
// // });

// // app.post('/api/clients', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'user') {
// //       return res.status(403).json({ error: 'User access required' });
// //     }

// //     const { name, email } = req.body;
    
// //     const client = new Client({
// //       name,
// //       email,
// //       googleFormLink: `https://docs.google.com/forms/d/e/1FAIpQLScVX1hndMaUFpQgPjG2EXcCimYhMTFNR-8t5QdVV1kr9flNAQ/viewform?usp=pp_url&entry.1234567890=${encodeURIComponent(email)}`,
// //       createdBy: req.user.userId
// //     });
    
// //     await client.save();
    
// //     // Send email to client
// //     const emailSubject = 'Please complete your handwriting analysis questionnaire';
// //     const emailHtml = `
// //       <p>Dear ${name},</p>
// //       <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
// //       <a href="${client.googleFormLink}">Click here to complete the questionnaire</a>
// //       <p>Thank you!</p>
// //     `;
    
// //     await sendEmail(email, emailSubject, emailHtml);
    
// //     res.status(201).json(client);
// //   } catch (err) {
// //     console.error('Error creating client:', err);
// //     res.status(500).json({ error: 'Failed to create client' });
// //   }
// // });


// // // Get client by email
// // app.get('/api/clients/:email', async (req, res) => {
// //   try {
// //     const client = await Client.findOne({ email: req.params.email });
    
// //     if (!client) {
// //       return res.status(404).json({ error: 'Client not found' });
// //     }
    
// //     // Check if we have questionnaire scores
// //     if (!client.questionnaireScores) {
// //       // Try to fetch from Google Sheets
// //       await checkGoogleFormResponse(client);
// //     }
    
// //     res.json(client);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to fetch client' });
// //   }
// // });
// // app.get('/api/clients', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'user') {
// //       return res.status(403).json({ error: 'User access required' });
// //     }

// //     const clients = await Client.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
// //     res.json(clients);
// //   } catch (err) {
// //     console.error('Error fetching clients:', err);
// //     res.status(500).json({ error: 'Failed to fetch clients' });
// //   }
// // });
// // app.get('/api/clients/:id', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'user') {
// //       return res.status(403).json({ error: 'User access required' });
// //     }

// //     const client = await Client.findOne({ 
// //       _id: req.params.id, 
// //       createdBy: req.user.userId 
// //     });
    
// //     if (!client) {
// //       return res.status(404).json({ error: 'Client not found' });
// //     }
    
// //     res.json(client);
// //   } catch (err) {
// //     console.error('Error fetching client:', err);
// //     res.status(500).json({ error: 'Failed to fetch client' });
// //   }
// // });
// // // Check for form responses
// // app.get('/api/clients/:id/check-responses', authenticateToken, async (req, res) => {
// //   // Add timeout handling
// //   const timeoutPromise = new Promise((_, reject) => {
// //     setTimeout(() => {
// //       reject(new Error('Database operation timed out'));
// //     }, 8000); // Reject after 8 seconds
// //   });

// //   try {
// //     if (req.user.role !== 'user') {
// //       return res.status(403).json({ error: 'User access required' });
// //     }

// //     // Race the DB query against our timeout
// //     const client = await Promise.race([
// //       Client.findOne({ 
// //         _id: req.params.id, 
// //         createdBy: req.user.userId 
// //       }),
// //       timeoutPromise
// //     ]);

// //     if (!client) {
// //       return res.status(404).json({ error: 'Client not found' });
// //     }

// //     // Get scores from Google Sheet with timeout
// //     const scores = await Promise.race([
// //       getScoresFromNewSheet(client.email),
// //       timeoutPromise
// //     ]);

// //     if (scores) {
// //       const updateOperation = Promise.race([
// //         Client.findByIdAndUpdate(
// //           req.params.id,
// //           { 
// //             questionnaireScores: scores,
// //             combinedScores: calculateCombinedScores(client.scriptScores, scores, client.weight)
// //           },
// //           { new: true }
// //         ),
// //         timeoutPromise
// //       ]);

// //       const updatedClient = await updateOperation;
      
// //       return res.json({ 
// //         updated: true,
// //         client: updatedClient
// //       });
// //     }
    
// //     res.json({ updated: false });
// //   } catch (err) {
// //     console.error('Error checking responses:', err.message);
    
// //     // Specific error messages
// //     if (err.message.includes('timed out')) {
// //       return res.status(504).json({ 
// //         error: 'Database timeout',
// //         message: 'The operation took too long to complete'
// //       });
// //     }
    
// //     res.status(500).json({ 
// //       error: 'Failed to check responses',
// //       details: err.message 
// //     });
// //   }
// // });
// // app.get('/health', async (req, res) => {
// //   try {
// //     // Simple ping to check if DB is responsive
// //     await mongoose.connection.db.admin().ping();
// //     res.json({
// //       status: 'healthy',
// //       database: 'connected',
// //       timestamp: new Date()
// //     });
// //   } catch (err) {
// //     res.status(503).json({
// //       status: 'unhealthy',
// //       database: 'disconnected',
// //       error: err.message
// //     });
// //   }
// // });
// // // Helper function
// // function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
// //   if (!scriptScores || !questionnaireScores) return null;
  
// //   const combined = {};
// //   Object.keys(scriptScores).forEach(key => {
// //     const scriptValue = scriptScores[key] || 0;
// //     const questionnaireValue = questionnaireScores[key] || 0;
// //     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
// //   });
  
// //   return combined;
// // }
// // // Update client (e.g., adjust weights)
// // // Make sure your client routes include proper authentication
// // app.put('/api/clients/:id', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'user') {
// //       return res.status(403).json({ error: 'User access required' });
// //     }

// //     const { weight, scriptScores } = req.body;
    
// //     const client = await Client.findOne({ 
// //       _id: req.params.id, 
// //       createdBy: req.user.userId 
// //     });
    
// //     if (!client) {
// //       return res.status(404).json({ error: 'Client not found' });
// //     }

// //     // Get updated scores from Google Sheet
// //     const questionnaireScores = await getScoresFromNewSheet(client.email);
    
// //     const updatedClient = await Client.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         weight,
// //         scriptScores,
// //         questionnaireScores,
// //         combinedScores: calculateCombinedScores(scriptScores, questionnaireScores, weight)
// //       },
// //       { new: true }
// //     );
    
// //     res.json(updatedClient);
// //   } catch (err) {
// //     console.error('Error updating client:', err);
// //     res.status(500).json({ error: 'Failed to update client' });
// //   }
// // });
// // app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
// //   try {
// //     if (req.user.role !== 'user') {
// //       return res.status(403).json({ error: 'User access required' });
// //     }

// //     const client = await Client.findOneAndDelete({ 
// //       _id: req.params.id, 
// //       createdBy: req.user.userId 
// //     });
    
// //     if (!client) {
// //       return res.status(404).json({ error: 'Client not found' });
// //     }
    
// //     res.json({ message: 'Client deleted successfully' });
// //   } catch (err) {
// //     console.error('Error deleting client:', err);
// //     res.status(500).json({ error: 'Failed to delete client' });
// //   }
// // });

// // // Helper function to check Google Form responses
// // async function checkGoogleFormResponse(client) {
// //   try {
// //     const authClient = await auth.getClient();
// //     const spreadsheetId = '1XBLry0OaK5PPZbWJBaEPPI1_563WAkc8svQthekemUU';
// //     const range = 'Form Responses 2';
    
// //     const response = await sheets.spreadsheets.values.get({
// //       auth: authClient,
// //       spreadsheetId,
// //       range,
// //     });
    
// //     const rows = response.data.values;
// //     if (!rows || rows.length === 0) return;
    
// //     // Find the row with matching email
// //     const headers = rows[0];
// //     const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
// //     const timestampIndex = headers.findIndex(h => h.toLowerCase().includes('timestamp'));
    
// //     if (emailIndex === -1) return;
    
// //     for (let i = 1; i < rows.length; i++) {
// //       const row = rows[i];
// //       if (row[emailIndex] === client.email) {
// //         // Found the response - calculate scores
// //         const scores = calculateQuestionnaireScores(row, headers);
        
// //         // Update client record
// //         client.questionnaireScores = scores;
// //         client.googleFormResponseId = row[timestampIndex];
// //         client.combinedScores = calculateCombinedScores(
// //           client.scriptScores,
// //           scores,
// //           client.weight
// //         );
        
// //         await client.save();
// //         break;
// //       }
// //     }
// //   } catch (err) {
// //     console.error('Error checking Google Form responses:', err);
// //   }
// // }

// // // Helper function to calculate questionnaire scores from form responses
// // function calculateQuestionnaireScores(row, headers) {
// //   // This should implement your Excel sheet calculations
// //   // Here's a simplified example - adjust based on your actual calculations
  
// //   // Find indices of relevant questions
// //   const cumulativeIndices = [/* indices of cumulative questions */];
// //   const investigativeIndices = [/* indices of investigative questions */];
// //   const comprehensiveIndices = [/* indices of comprehensive questions */];
// //   const analyticalIndices = [/* indices of analytical questions */];
  
// //   // Calculate scores (this is simplified - use your actual calculation logic)
// //   const cumulativeScore = calculateSectionScore(row, cumulativeIndices);
// //   const investigativeScore = calculateSectionScore(row, investigativeIndices);
// //   const comprehensiveScore = calculateSectionScore(row, comprehensiveIndices);
// //   const analyticalScore = calculateSectionScore(row, analyticalIndices);
  
// //   return {
// //     Cumulative: cumulativeScore,
// //     Investigative: investigativeScore,
// //     Comprehensive: comprehensiveScore,
// //     Analytical: analyticalScore
// //   };
// // }

// // function calculateSectionScore(row, indices) {
// //   let total = 0;
// //   let count = 0;
  
// //   for (const index of indices) {
// //     if (row[index]) {
// //       total += parseInt(row[index]) || 0;
// //       count++;
// //     }
// //   }
  
// //   return count > 0 ? Math.round((total / (count * 5)) * 100) : 0; // Assuming 5-point scale
// // }

// // function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
// //   const combined = {};
  
// //   if (!scriptScores || !questionnaireScores) return null;
  
// //   Object.keys(scriptScores).forEach(key => {
// //     const scriptValue = scriptScores[key] || 0;
// //     const questionnaireValue = questionnaireScores[key] || 0;
// //     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
// //   });
  
// //   return combined;
// // }
// // app.get('/test-new-sheet', async (req, res) => {
// //   try {
// //     const testEmail = 'test@example.com'; // Replace with an email from your sheet
// //     const scores = await getScoresFromNewSheet(testEmail);
    
// //     if (!scores) {
// //       return res.status(404).json({ error: 'No scores found for test email' });
// //     }
    
// //     res.json({
// //       success: true,
// //       message: 'Successfully connected to new Google Sheet',
// //       scores
// //     });
// //   } catch (err) {
// //     console.error('Test connection error:', err);
// //     res.status(500).json({
// //       error: 'Failed to connect to Google Sheet',
// //       details: err.message
// //     });
// //   }
// // });
// // // Add this endpoint to your server.js
// // app.post('/api/refresh-token', authenticateToken, async (req, res) => {
// //   try {
// //     let user;
// //     if (req.user.role === 'user') {
// //       user = await User.findById(req.user.userId);
// //     } else if (req.user.role === 'admin') {
// //       user = await Admin.findById(req.user.adminId);
// //     }

// //     if (!user) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }

// //     const token = jwt.sign(
// //       req.user.role === 'user' 
// //         ? { userId: user._id, email: user.email, role: 'user' }
// //         : { adminId: user._id, email: user.email, role: 'admin' },
// //       JWT_SECRET,
// //       { expiresIn: '24h' }
// //     );

// //     res.json({ token });
// //   } catch (error) {
// //     console.error('Token refresh error:', error);
// //     res.status(500).json({ error: 'Failed to refresh token' });
// //   }
// // });

// // // //////////////////////////////////////////////////////////////////////////////////////////////

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const axios = require('axios'); // Added for Brevo API

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// const mongoURI = process.env.MONGO_URI;
// mongoose.connect(mongoURI)
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));


// const BREVO_API_KEY = process.env.BREVO_API_KEY;
// const BREVO_SENDER_EMAIL = 'sagu20102004@gmail.com';
// const BREVO_SENDER_NAME = 'Grapho Genius';





// const sendEmailViaBrevo = async (to, subject, htmlContent) => {
//   try {
//     const emailData = {
//       sender: {
//         name: BREVO_SENDER_NAME,
//         email: BREVO_SENDER_EMAIL
//       },
//       to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
//       subject: subject,
//       htmlContent: htmlContent
//     };

//     const response = await axios.post(
//       'https://api.brevo.com/v3/smtp/email',
//       emailData,
//       {
//         headers: {
//           'accept': 'application/json',
//           'api-key': BREVO_API_KEY,
//           'content-type': 'application/json'
//         }
//       }
//     );

//     console.log('✅ Email sent successfully via Brevo:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Brevo API Error:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
//     throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
//   }
// };

// /**
//  * Send email to multiple recipients using Brevo
//  */
// const sendEmailToMultiple = async (recipients, subject, htmlContent) => {
//   try {
//     const emailData = {
//       sender: {
//         name: BREVO_SENDER_NAME,
//         email: BREVO_SENDER_EMAIL
//       },
//       to: recipients.map(email => ({ email })),
//       subject: subject,
//       htmlContent: htmlContent
//     };

//     const response = await axios.post(
//       'https://api.brevo.com/v3/smtp/email',
//       emailData,
//       {
//         headers: {
//           'accept': 'application/json',
//           'api-key': BREVO_API_KEY,
//           'content-type': 'application/json'
//         }
//       }
//     );

//     console.log(`✅ Email sent successfully to ${recipients.length} recipients via Brevo`);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Brevo API Error (multiple recipients):', error.response?.data || error.message);
//     throw error;
//   }
// };


// const sendEmail = async (to, subject, html) => {
//   return await sendEmailViaBrevo(to, subject, html);
// };

// // ============================================
// // TEST BREVO CONNECTION ENDPOINT
// // ============================================
// app.get('/test-brevo', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with your email for testing
    
//     const result = await sendEmailViaBrevo(
//       testEmail,
//       'Test Email from Brevo API',
//       '<h2>✅ Brevo Integration Test</h2><p>If you receive this email, Brevo API is working correctly!</p>'
//     );
    
//     res.json({
//       success: true,
//       message: 'Test email sent via Brevo API',
//       result
//     });
//   } catch (error) {
//     console.error('Test failed:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to send test email',
//       details: error.message
//     });
//   }
// });

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobile: { type: String, required: true },
//   role: { 
//     type: String, 
//     required: true,
//     enum: ['Graphologist', 'Hiring Manager', 'Psychiatrist', 'Other']
//   },
//   otherRole: { type: String },
//   password: { type: String },
//   isVerified: { type: Boolean, default: false },
//   verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
//   verifiedAt: { type: Date },
//   createdAt: { type: Date, default: Date.now },
//   lastLogin: { type: Date },
//   isActive: { type: Boolean, default: true }
// });

// // Admin Schema
// const adminSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobile: { type: String, required: true },
//   password: { type: String, required: true },
//   department: { type: String },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   lastLogin: { type: Date }
// });

// // User Activity Schema
// const userActivitySchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   action: { type: String, required: true }, // login, logout, register, verify
//   timestamp: { type: Date, default: Date.now },
//   ipAddress: { type: String },
//   userAgent: { type: String }
// });

// const User = mongoose.model('User', userSchema);
// const Admin = mongoose.model('Admin', adminSchema);
// const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// // JWT Secret
// const JWT_SECRET = 'your-secret-key-here';

// // Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// // TEMPORARY: Create default admin (remove after use)
// app.get('/create-default-admin', async (req, res) => {
//   try {
//     const existing = await Admin.findOne({ email: 'admin@example.com' });
//     if (existing) return res.send('Admin already exists.');

//     const hashedPassword = await bcrypt.hash('admin123', 10); // default password
//     const admin = new Admin({
//       name: 'Super Admin',
//       email: 'admin@example.com',
//       mobile: '1234567890',
//       department: 'IT',
//       password: hashedPassword,
//       isActive: true,
//     });

//     await admin.save();
//     res.send('Default admin created. Use email: admin@example.com, password: admin123');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error creating admin');
//   }
// });


// // Helper function to log user activity
// const logActivity = async (userId, action, req) => {
//   try {
//     await UserActivity.create({
//       userId,
//       action,
//       ipAddress: req.ip,
//       userAgent: req.get('User-Agent')
//     });
//   } catch (error) {
//     console.error('Error logging activity:', error);
//   }
// };

// // Routes

// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, email, mobile, role, otherRole } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists with this email' });
//     }

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       mobile,
//       role,
//       otherRole: role === 'Other' ? otherRole : undefined
//     });

//     await user.save();
//     await logActivity(user._id, 'register', req);

//     // Send email to all admins USING BREVO
//     const admins = await Admin.find({ isActive: true });
//     const adminEmails = admins.map(admin => admin.email);

//     if (adminEmails.length > 0) {
//       const emailSubject = 'New User Registration - Approval Required';
//       const emailHtml = `
//         <h2>New User Registration</h2>
//         <p>A new user has registered and requires approval:</p>
//         <ul>
//           <li><strong>Name:</strong> ${name}</li>
//           <li><strong>Email:</strong> ${email}</li>
//           <li><strong>Mobile:</strong> ${mobile}</li>
//           <li><strong>Role:</strong> ${role}${role === 'Other' ? ` (${otherRole})` : ''}</li>
//           <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
//         </ul>
//         <p>Please log in to the admin dashboard to approve or reject this user.</p>
//       `;

//       await sendEmailToMultiple(adminEmails, emailSubject, emailHtml);
//     }

//     res.status(201).json({ 
//       message: 'Registration successful. Please wait for admin approval.',
//       userId: user._id 
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // User Login
// app.post('/api/user/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !user.isVerified) {
//       return res.status(401).json({ error: 'Invalid credentials or account not verified' });
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();
//     await logActivity(user._id, 'login', req);

//     const token = jwt.sign(
//       { userId: user._id, email: user.email, role: 'user' },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         otherRole: user.otherRole
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Admin Login
// app.post('/api/admin/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email, isActive: true });
//     if (!admin) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const isValidPassword = await bcrypt.compare(password, admin.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Update last login
//     admin.lastLogin = new Date();
//     await admin.save();

//     const token = jwt.sign(
//       { adminId: admin._id, email: admin.email, role: 'admin' },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       token,
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         department: admin.department
//       }
//     });
//   } catch (error) {
//     console.error('Admin login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get pending user requests (Admin only)
// app.get('/api/admin/pending-users', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const pendingUsers = await User.find({ isVerified: false }).sort({ createdAt: -1 });
//     res.json(pendingUsers);
//   } catch (error) {
//     console.error('Error fetching pending users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Verify user (Admin only)
// app.post('/api/admin/verify-user/:userId', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const { userId } = req.params;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ error: 'User already verified' });
//     }

//     // Generate random password
//     const tempPassword = crypto.randomBytes(8).toString('hex');
//     const hashedPassword = await bcrypt.hash(tempPassword, 10);

//     // Update user
//     user.password = hashedPassword;
//     user.isVerified = true;
//     user.verifiedBy = req.user.adminId;
//     user.verifiedAt = new Date();
//     await user.save();

//     await logActivity(user._id, 'verify', req);

//     // Send email to user with credentials USING BREVO
//     const emailSubject = 'Account Approved - Login Credentials';
//     const emailHtml = `
//       <h2>Account Approved</h2>
//       <p>Dear ${user.name},</p>
//       <p>Your account has been approved by our admin team. You can now log in to the system using the following credentials:</p>
//       <ul>
//         <li><strong>Email:</strong> ${user.email}</li>
//         <li><strong>Password:</strong> ${tempPassword}</li>
//       </ul>
//       <p>Please log in and change your password for security purposes.</p>
//       <p>Welcome to the Handwritten Pattern Prediction System!</p>
//       <p><a href="https://grapho-genius-ai.vercel.app/user-login" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Click here to login</a></p>
//     `;

//     await sendEmailViaBrevo(user.email, emailSubject, emailHtml);

//     res.json({ message: 'User verified successfully and credentials sent via email' });
//   } catch (error) {
//     console.error('Error verifying user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Get all users (Admin only)
// app.get('/api/admin/users', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const users = await User.find()
//       .populate('verifiedBy', 'name email')
//       .sort({ createdAt: -1 });
    
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get user activities (Admin only)
// app.get('/api/admin/user-activities', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const activities = await UserActivity.find()
//       .populate('userId', 'name email')
//       .sort({ timestamp: -1 })
//       .limit(100);
    
//     res.json(activities);
//   } catch (error) {
//     console.error('Error fetching activities:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // User logout
// app.post('/api/user/logout', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role === 'user') {
//       await logActivity(req.user.userId, 'logout', req);
//     }
//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get user profile
// app.get('/api/user/profile', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////////////

// // Define Client Schema
// const clientSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   googleFormLink: String,
//   googleFormResponseId: String,
//   questionnaireScores: {
//     Cumulative: Number,
//     Investigative: Number,
//     Comprehensive: Number,
//     Analytical: Number
//   },
//   scriptScores: Object,
//   combinedScores: Object,
//   weight: { type: Number, default: 50 },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Client = mongoose.model('Client', clientSchema);



// const { google } = require('googleapis');
// const sheets = google.sheets('v4');

// // Initialize auth with service account credentials
// // const auth = new google.auth.GoogleAuth({
// //   keyFile: 'googleSheetsAPI.json', // Your downloaded JSON file
// //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // });

// // const auth = new google.auth.GoogleAuth({
// //   keyFile: '/etc/secrets/googleSheetsAPI.json',
// //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // });
// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     type: process.env.GOOGLE_TYPE,
//     project_id: process.env.GOOGLE_PROJECT_ID,
//     private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
//     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     client_email: process.env.GOOGLE_CLIENT_EMAIL,
//     client_id: process.env.GOOGLE_CLIENT_ID,
//     auth_uri: process.env.GOOGLE_AUTH_URI,
//     token_uri: process.env.GOOGLE_TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
//     client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
//     universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
//   },
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// async function getScoresFromNewSheet(clientEmail) {
//   try {
//     const authClient = await auth.getClient();
//     const spreadsheetId = '1oYSj9bU3b5g-CzSCESbg8RAvuzj0dhXHdODRl_GhSno';
    
//     // First, list all available sheets
//     const spreadsheet = await sheets.spreadsheets.get({
//       auth: authClient,
//       spreadsheetId,
//     });

//     // Log all sheet names for debugging
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

//     // Get all data from the sheet (extended range to include all columns)
//     const response = await sheets.spreadsheets.values.get({
//       auth: authClient,
//       spreadsheetId,
//       range: `${sheetName}!A:BJ`, // Extended range to include all columns
//     });

//     const rows = response.data.values;
//     if (!rows || rows.length === 0) {
//       console.log('No data found in sheet');
//       return null;
//     }

//     // Log first row headers for verification
//     console.log('Headers:', rows[0]);

//     // Find column indexes dynamically based on headers
//     const headers = rows[0].map(h => h.toString().toLowerCase());
    
//     // Email is in column C (index 2)
//     const emailColIndex = 2;
    
//     // Find score columns (note the typo in "Comphrehensive")
//     const cumulativeColIndex = headers.findIndex(h => h.includes('cumulative %'));
//     const comprehensiveColIndex = headers.findIndex(h => h.includes('comphrehensive %')); // Note the typo
//     const investigativeColIndex = headers.findIndex(h => h.includes('investigative %'));
//     const analyticalColIndex = headers.findIndex(h => h.includes('analytical %'));

//     console.log('Found columns:', {
//       email: emailColIndex,
//       cumulative: cumulativeColIndex,
//       comprehensive: comprehensiveColIndex,
//       investigative: investigativeColIndex,
//       analytical: analyticalColIndex
//     });

//     // Verify we found all required columns
//     if (cumulativeColIndex === -1 || comprehensiveColIndex === -1 || 
//         investigativeColIndex === -1 || analyticalColIndex === -1) {
//       console.error('Missing required score columns');
//       return null;
//     }

//     // Find the row with matching email
//     for (let i = 1; i < rows.length; i++) {
//       const row = rows[i];
//       if (row[emailColIndex] && 
//           row[emailColIndex].toString().trim().toLowerCase() === clientEmail.trim().toLowerCase()) {
//         console.log('Found matching row:', row);
        
//         // Extract and parse scores
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
//     console.error('Google Sheets API error:', err.message);
//     if (err.response) {
//       console.error('API response error:', JSON.stringify(err.response.data, null, 2));
//     }
//     return null;
//   }
// }
// app.get('/test-sheet', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with actual email from sheet
//     const scores = await getScoresFromNewSheet(testEmail);
    
//     if (!scores) {
//       return res.status(404).json({ 
//         error: 'No scores found',
//         message: 'Make sure the email exists in the sheet and columns are correct'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Successfully fetched scores from Google Sheet',
//       scores
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: 'Failed to fetch scores',
//       details: err.message
//     });
//   }
// });

// app.get('/test-sheet-connection', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with an email from your sheet
//     const scores = await getScoresFromNewSheet(testEmail);
    
//     if (!scores) {
//       return res.status(404).json({ error: 'No scores found for test email' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Successfully connected to Google Sheets',
//       scores
//     });
//   } catch (err) {
//     console.error('Test connection error:', err);
//     res.status(500).json({
//       error: 'Failed to connect to Google Sheets',
//       details: err.message
//     });
//   }
// });

// app.post('/api/clients', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const { name, email } = req.body;
    
//     const client = new Client({
//       name,
//       email,
//       googleFormLink: `https://docs.google.com/forms/d/e/1FAIpQLScVX1hndMaUFpQgPjG2EXcCimYhMTFNR-8t5QdVV1kr9flNAQ/viewform?usp=pp_url&entry.1234567890=${encodeURIComponent(email)}`,
//       createdBy: req.user.userId
//     });
    
//     await client.save();
    
//     // Send email to client
//     const emailSubject = 'Please complete your handwriting analysis questionnaire';
//     const emailHtml = `
//       <p>Dear ${name},</p>
//       <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
//       <a href="${client.googleFormLink}">Click here to complete the questionnaire</a>
//       <p>Thank you!</p>
//     `;
    
//     await sendEmail(email, emailSubject, emailHtml);
    
//     res.status(201).json(client);
//   } catch (err) {
//     console.error('Error creating client:', err);
//     res.status(500).json({ error: 'Failed to create client' });
//   }
// });


// // Get client by email
// app.get('/api/clients/:email', async (req, res) => {
//   try {
//     const client = await Client.findOne({ email: req.params.email });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }
    
//     // Check if we have questionnaire scores
//     if (!client.questionnaireScores) {
//       // Try to fetch from Google Sheets
//       await checkGoogleFormResponse(client);
//     }
    
//     res.json(client);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch client' });
//   }
// });
// app.get('/api/clients', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const clients = await Client.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
//     res.json(clients);
//   } catch (err) {
//     console.error('Error fetching clients:', err);
//     res.status(500).json({ error: 'Failed to fetch clients' });
//   }
// });
// app.get('/api/clients/:id', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const client = await Client.findOne({ 
//       _id: req.params.id, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }
    
//     res.json(client);
//   } catch (err) {
//     console.error('Error fetching client:', err);
//     res.status(500).json({ error: 'Failed to fetch client' });
//   }
// });
// // Check for form responses
// app.get('/api/clients/:id/check-responses', authenticateToken, async (req, res) => {
//   // Add timeout handling
//   const timeoutPromise = new Promise((_, reject) => {
//     setTimeout(() => {
//       reject(new Error('Database operation timed out'));
//     }, 8000); // Reject after 8 seconds
//   });

//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     // Race the DB query against our timeout
//     const client = await Promise.race([
//       Client.findOne({ 
//         _id: req.params.id, 
//         createdBy: req.user.userId 
//       }),
//       timeoutPromise
//     ]);

//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     // Get scores from Google Sheet with timeout
//     const scores = await Promise.race([
//       getScoresFromNewSheet(client.email),
//       timeoutPromise
//     ]);

//     if (scores) {
//       const updateOperation = Promise.race([
//         Client.findByIdAndUpdate(
//           req.params.id,
//           { 
//             questionnaireScores: scores,
//             combinedScores: calculateCombinedScores(client.scriptScores, scores, client.weight)
//           },
//           { new: true }
//         ),
//         timeoutPromise
//       ]);

//       const updatedClient = await updateOperation;
      
//       return res.json({ 
//         updated: true,
//         client: updatedClient
//       });
//     }
    
//     res.json({ updated: false });
//   } catch (err) {
//     console.error('Error checking responses:', err.message);
    
//     // Specific error messages
//     if (err.message.includes('timed out')) {
//       return res.status(504).json({ 
//         error: 'Database timeout',
//         message: 'The operation took too long to complete'
//       });
//     }
    
//     res.status(500).json({ 
//       error: 'Failed to check responses',
//       details: err.message 
//     });
//   }
// });
// app.get('/health', async (req, res) => {
//   try {
//     // Simple ping to check if DB is responsive
//     await mongoose.connection.db.admin().ping();
//     res.json({
//       status: 'healthy',
//       database: 'connected',
//       timestamp: new Date()
//     });
//   } catch (err) {
//     res.status(503).json({
//       status: 'unhealthy',
//       database: 'disconnected',
//       error: err.message
//     });
//   }
// });
// // Helper function
// function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
//   if (!scriptScores || !questionnaireScores) return null;
  
//   const combined = {};
//   Object.keys(scriptScores).forEach(key => {
//     const scriptValue = scriptScores[key] || 0;
//     const questionnaireValue = questionnaireScores[key] || 0;
//     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
//   });
  
//   return combined;
// }
// // Update client (e.g., adjust weights)
// // Make sure your client routes include proper authentication
// app.put('/api/clients/:id', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const { weight, scriptScores } = req.body;
    
//     const client = await Client.findOne({ 
//       _id: req.params.id, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     // Get updated scores from Google Sheet
//     const questionnaireScores = await getScoresFromNewSheet(client.email);
    
//     const updatedClient = await Client.findByIdAndUpdate(
//       req.params.id,
//       {
//         weight,
//         scriptScores,
//         questionnaireScores,
//         combinedScores: calculateCombinedScores(scriptScores, questionnaireScores, weight)
//       },
//       { new: true }
//     );
    
//     res.json(updatedClient);
//   } catch (err) {
//     console.error('Error updating client:', err);
//     res.status(500).json({ error: 'Failed to update client' });
//   }
// });
// app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const client = await Client.findOneAndDelete({ 
//       _id: req.params.id, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }
    
//     res.json({ message: 'Client deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting client:', err);
//     res.status(500).json({ error: 'Failed to delete client' });
//   }
// });

// // Helper function to check Google Form responses
// async function checkGoogleFormResponse(client) {
//   try {
//     const authClient = await auth.getClient();
//     const spreadsheetId = '1XBLry0OaK5PPZbWJBaEPPI1_563WAkc8svQthekemUU';
//     const range = 'Form Responses 2';
    
//     const response = await sheets.spreadsheets.values.get({
//       auth: authClient,
//       spreadsheetId,
//       range,
//     });
    
//     const rows = response.data.values;
//     if (!rows || rows.length === 0) return;
    
//     // Find the row with matching email
//     const headers = rows[0];
//     const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
//     const timestampIndex = headers.findIndex(h => h.toLowerCase().includes('timestamp'));
    
//     if (emailIndex === -1) return;
    
//     for (let i = 1; i < rows.length; i++) {
//       const row = rows[i];
//       if (row[emailIndex] === client.email) {
//         // Found the response - calculate scores
//         const scores = calculateQuestionnaireScores(row, headers);
        
//         // Update client record
//         client.questionnaireScores = scores;
//         client.googleFormResponseId = row[timestampIndex];
//         client.combinedScores = calculateCombinedScores(
//           client.scriptScores,
//           scores,
//           client.weight
//         );
        
//         await client.save();
//         break;
//       }
//     }
//   } catch (err) {
//     console.error('Error checking Google Form responses:', err);
//   }
// }

// // Helper function to calculate questionnaire scores from form responses
// function calculateQuestionnaireScores(row, headers) {
//   // This should implement your Excel sheet calculations
//   // Here's a simplified example - adjust based on your actual calculations
  
//   // Find indices of relevant questions
//   const cumulativeIndices = [/* indices of cumulative questions */];
//   const investigativeIndices = [/* indices of investigative questions */];
//   const comprehensiveIndices = [/* indices of comprehensive questions */];
//   const analyticalIndices = [/* indices of analytical questions */];
  
//   // Calculate scores (this is simplified - use your actual calculation logic)
//   const cumulativeScore = calculateSectionScore(row, cumulativeIndices);
//   const investigativeScore = calculateSectionScore(row, investigativeIndices);
//   const comprehensiveScore = calculateSectionScore(row, comprehensiveIndices);
//   const analyticalScore = calculateSectionScore(row, analyticalIndices);
  
//   return {
//     Cumulative: cumulativeScore,
//     Investigative: investigativeScore,
//     Comprehensive: comprehensiveScore,
//     Analytical: analyticalScore
//   };
// }

// function calculateSectionScore(row, indices) {
//   let total = 0;
//   let count = 0;
  
//   for (const index of indices) {
//     if (row[index]) {
//       total += parseInt(row[index]) || 0;
//       count++;
//     }
//   }
  
//   return count > 0 ? Math.round((total / (count * 5)) * 100) : 0; // Assuming 5-point scale
// }

// function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
//   const combined = {};
  
//   if (!scriptScores || !questionnaireScores) return null;
  
//   Object.keys(scriptScores).forEach(key => {
//     const scriptValue = scriptScores[key] || 0;
//     const questionnaireValue = questionnaireScores[key] || 0;
//     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
//   });
  
//   return combined;
// }
// app.get('/test-new-sheet', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with an email from your sheet
//     const scores = await getScoresFromNewSheet(testEmail);
    
//     if (!scores) {
//       return res.status(404).json({ error: 'No scores found for test email' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Successfully connected to new Google Sheet',
//       scores
//     });
//   } catch (err) {
//     console.error('Test connection error:', err);
//     res.status(500).json({
//       error: 'Failed to connect to Google Sheet',
//       details: err.message
//     });
//   }
// });
// // Add this endpoint to your server.js
// app.post('/api/refresh-token', authenticateToken, async (req, res) => {
//   try {
//     let user;
//     if (req.user.role === 'user') {
//       user = await User.findById(req.user.userId);
//     } else if (req.user.role === 'admin') {
//       user = await Admin.findById(req.user.adminId);
//     }

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const token = jwt.sign(
//       req.user.role === 'user' 
//         ? { userId: user._id, email: user.email, role: 'user' }
//         : { adminId: user._id, email: user.email, role: 'admin' },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({ token });
//   } catch (error) {
//     console.error('Token refresh error:', error);
//     res.status(500).json({ error: 'Failed to refresh token' });
//   }
// });
// // Send form to client
// app.post('/api/clients/send-form', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const { clientId } = req.body;
    
//     const client = await Client.findOne({ 
//       _id: clientId, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     // Send email to client with the form link
//     const emailSubject = 'Please complete your handwriting analysis questionnaire';
//     const emailHtml = `
//       <p>Dear ${client.name},</p>
//       <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
//       <a href="${client.googleFormLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Click here to complete the questionnaire</a>
//       <p><strong>Link:</strong> ${client.googleFormLink}</p>
//       <p>Thank you!</p>
//     `;
    
//     await sendEmail(client.email, emailSubject, emailHtml);
    
//     res.json({ 
//       message: 'Form sent successfully to client',
//       client: {
//         id: client._id,
//         name: client.name,
//         email: client.email
//       }
//     });
//   } catch (err) {
//     console.error('Error sending form:', err);
//     res.status(500).json({ error: 'Failed to send form to client' });
//   }
// });
// // //////////////////////////////////////////////////////////////////////////////////////////////

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const axios = require('axios'); // Added for Brevo API
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// const mongoURI = process.env.MONGO_URI;
// mongoose.connect(mongoURI)
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));


// const BREVO_API_KEY = process.env.BREVO_API_KEY;
// const BREVO_SENDER_EMAIL = 'sagu20102004@gmail.com';
// const BREVO_SENDER_NAME = 'Grapho Genius';





// const sendEmailViaBrevo = async (to, subject, htmlContent) => {
//   try {
//     const emailData = {
//       sender: {
//         name: BREVO_SENDER_NAME,
//         email: BREVO_SENDER_EMAIL
//       },
//       to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
//       subject: subject,
//       htmlContent: htmlContent
//     };

//     const response = await axios.post(
//       'https://api.brevo.com/v3/smtp/email',
//       emailData,
//       {
//         headers: {
//           'accept': 'application/json',
//           'api-key': BREVO_API_KEY,
//           'content-type': 'application/json'
//         }
//       }
//     );

//     console.log('✅ Email sent successfully via Brevo:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Brevo API Error:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
//     throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
//   }
// };

// /**
//  * Send email to multiple recipients using Brevo
//  */
// const sendEmailToMultiple = async (recipients, subject, htmlContent) => {
//   try {
//     const emailData = {
//       sender: {
//         name: BREVO_SENDER_NAME,
//         email: BREVO_SENDER_EMAIL
//       },
//       to: recipients.map(email => ({ email })),
//       subject: subject,
//       htmlContent: htmlContent
//     };

//     const response = await axios.post(
//       'https://api.brevo.com/v3/smtp/email',
//       emailData,
//       {
//         headers: {
//           'accept': 'application/json',
//           'api-key': BREVO_API_KEY,
//           'content-type': 'application/json'
//         }
//       }
//     );

//     console.log(`✅ Email sent successfully to ${recipients.length} recipients via Brevo`);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Brevo API Error (multiple recipients):', error.response?.data || error.message);
//     throw error;
//   }
// };


// const sendEmail = async (to, subject, html) => {
//   return await sendEmailViaBrevo(to, subject, html);
// };

// // ============================================
// // TEST BREVO CONNECTION ENDPOINT
// // ============================================
// app.get('/test-brevo', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with your email for testing
    
//     const result = await sendEmailViaBrevo(
//       testEmail,
//       'Test Email from Brevo API',
//       '<h2>✅ Brevo Integration Test</h2><p>If you receive this email, Brevo API is working correctly!</p>'
//     );
    
//     res.json({
//       success: true,
//       message: 'Test email sent via Brevo API',
//       result
//     });
//   } catch (error) {
//     console.error('Test failed:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to send test email',
//       details: error.message
//     });
//   }
// });

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobile: { type: String, required: true },
//   role: { 
//     type: String, 
//     required: true,
//     enum: ['Graphologist', 'Hiring Manager', 'Psychiatrist', 'Other']
//   },
//   otherRole: { type: String },
//   password: { type: String },
//   isVerified: { type: Boolean, default: false },
//   verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
//   verifiedAt: { type: Date },
//   createdAt: { type: Date, default: Date.now },
//   lastLogin: { type: Date },
//   isActive: { type: Boolean, default: true }
// });

// // Admin Schema
// const adminSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobile: { type: String, required: true },
//   password: { type: String, required: true },
//   department: { type: String },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   lastLogin: { type: Date }
// });

// // User Activity Schema
// const userActivitySchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   action: { type: String, required: true }, // login, logout, register, verify
//   timestamp: { type: Date, default: Date.now },
//   ipAddress: { type: String },
//   userAgent: { type: String }
// });

// const User = mongoose.model('User', userSchema);
// const Admin = mongoose.model('Admin', adminSchema);
// const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// // JWT Secret
// const JWT_SECRET = 'your-secret-key-here';

// // Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// // TEMPORARY: Create default admin (remove after use)
// app.get('/create-default-admin', async (req, res) => {
//   try {
//     const existing = await Admin.findOne({ email: 'admin@example.com' });
//     if (existing) return res.send('Admin already exists.');

//     const hashedPassword = await bcrypt.hash('admin123', 10); // default password
//     const admin = new Admin({
//       name: 'Super Admin',
//       email: 'admin@example.com',
//       mobile: '1234567890',
//       department: 'IT',
//       password: hashedPassword,
//       isActive: true,
//     });

//     await admin.save();
//     res.send('Default admin created. Use email: admin@example.com, password: admin123');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error creating admin');
//   }
// });


// // Helper function to log user activity
// const logActivity = async (userId, action, req) => {
//   try {
//     await UserActivity.create({
//       userId,
//       action,
//       ipAddress: req.ip,
//       userAgent: req.get('User-Agent')
//     });
//   } catch (error) {
//     console.error('Error logging activity:', error);
//   }
// };

// // Routes

// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, email, mobile, role, otherRole } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists with this email' });
//     }

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       mobile,
//       role,
//       otherRole: role === 'Other' ? otherRole : undefined
//     });

//     await user.save();
//     await logActivity(user._id, 'register', req);

//     // Send email to all admins USING BREVO
//     const admins = await Admin.find({ isActive: true });
//     const adminEmails = admins.map(admin => admin.email);

//     if (adminEmails.length > 0) {
//       const emailSubject = 'New User Registration - Approval Required';
//       const emailHtml = `
//         <h2>New User Registration</h2>
//         <p>A new user has registered and requires approval:</p>
//         <ul>
//           <li><strong>Name:</strong> ${name}</li>
//           <li><strong>Email:</strong> ${email}</li>
//           <li><strong>Mobile:</strong> ${mobile}</li>
//           <li><strong>Role:</strong> ${role}${role === 'Other' ? ` (${otherRole})` : ''}</li>
//           <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
//         </ul>
//         <p>Please log in to the admin dashboard to approve or reject this user.</p>
//       `;

//       await sendEmailToMultiple(adminEmails, emailSubject, emailHtml);
//     }

//     res.status(201).json({ 
//       message: 'Registration successful. Please wait for admin approval.',
//       userId: user._id 
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // User Login
// app.post('/api/user/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !user.isVerified) {
//       return res.status(401).json({ error: 'Invalid credentials or account not verified' });
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();
//     await logActivity(user._id, 'login', req);

//     const token = jwt.sign(
//       { userId: user._id, email: user.email, role: 'user' },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         otherRole: user.otherRole
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Admin Login
// app.post('/api/admin/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email, isActive: true });
//     if (!admin) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const isValidPassword = await bcrypt.compare(password, admin.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Update last login
//     admin.lastLogin = new Date();
//     await admin.save();

//     const token = jwt.sign(
//       { adminId: admin._id, email: admin.email, role: 'admin' },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       token,
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         department: admin.department
//       }
//     });
//   } catch (error) {
//     console.error('Admin login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Get pending user requests (Admin only)
// app.get('/api/admin/pending-users', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const pendingUsers = await User.find({ isVerified: false }).sort({ createdAt: -1 });
//     res.json(pendingUsers);
//   } catch (error) {
//     console.error('Error fetching pending users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Verify user (Admin only)
// app.post('/api/admin/verify-user/:userId', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const { userId } = req.params;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ error: 'User already verified' });
//     }

//     // Generate random password
//     const tempPassword = crypto.randomBytes(8).toString('hex');
//     const hashedPassword = await bcrypt.hash(tempPassword, 10);

//     // Update user
//     user.password = hashedPassword;
//     user.isVerified = true;
//     user.verifiedBy = req.user.adminId;
//     user.verifiedAt = new Date();
//     await user.save();

//     await logActivity(user._id, 'verify', req);

//     // Send email to user with credentials USING BREVO
//     const emailSubject = 'Account Approved - Login Credentials';
//     const emailHtml = `
//       <h2>Account Approved</h2>
//       <p>Dear ${user.name},</p>
//       <p>Your account has been approved by our admin team. You can now log in to the system using the following credentials:</p>
//       <ul>
//         <li><strong>Email:</strong> ${user.email}</li>
//         <li><strong>Password:</strong> ${tempPassword}</li>
//       </ul>
//       <p>Please log in and change your password for security purposes.</p>
//       <p>Welcome to the Handwritten Pattern Prediction System!</p>
//       <p><a href="https://grapho-genius-ai.vercel.app/user-login" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Click here to login</a></p>
//     `;

//     await sendEmailViaBrevo(user.email, emailSubject, emailHtml);

//     res.json({ message: 'User verified successfully and credentials sent via email' });
//   } catch (error) {
//     console.error('Error verifying user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Get all users (Admin only)
// app.get('/api/admin/users', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const users = await User.find()
//       .populate('verifiedBy', 'name email')
//       .sort({ createdAt: -1 });
    
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get user activities (Admin only)
// app.get('/api/admin/user-activities', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const activities = await UserActivity.find()
//       .populate('userId', 'name email')
//       .sort({ timestamp: -1 })
//       .limit(100);
    
//     res.json(activities);
//   } catch (error) {
//     console.error('Error fetching activities:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // User logout
// app.post('/api/user/logout', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role === 'user') {
//       await logActivity(req.user.userId, 'logout', req);
//     }
//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get user profile
// app.get('/api/user/profile', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////////////

// // Define Client Schema
// const clientSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   googleFormLink: String,
//   googleFormResponseId: String,
//   questionnaireScores: {
//     Cumulative: Number,
//     Investigative: Number,
//     Comprehensive: Number,
//     Analytical: Number
//   },
//   scriptScores: Object,
//   combinedScores: Object,
//   weight: { type: Number, default: 50 },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Client = mongoose.model('Client', clientSchema);



// const { google } = require('googleapis');
// const sheets = google.sheets('v4');

// // Initialize auth with service account credentials
// // const auth = new google.auth.GoogleAuth({
// //   keyFile: 'googleSheetsAPI.json', // Your downloaded JSON file
// //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // });

// // const auth = new google.auth.GoogleAuth({
// //   keyFile: '/etc/secrets/googleSheetsAPI.json',
// //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// // });
// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     type: process.env.GOOGLE_TYPE,
//     project_id: process.env.GOOGLE_PROJECT_ID,
//     private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
//     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     client_email: process.env.GOOGLE_CLIENT_EMAIL,
//     client_id: process.env.GOOGLE_CLIENT_ID,
//     auth_uri: process.env.GOOGLE_AUTH_URI,
//     token_uri: process.env.GOOGLE_TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
//     client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
//     universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
//   },
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// async function getScoresFromNewSheet(clientEmail) {
//   try {
//     const authClient = await auth.getClient();
//     const spreadsheetId = '1oYSj9bU3b5g-CzSCESbg8RAvuzj0dhXHdODRl_GhSno';
    
//     // First, list all available sheets
//     const spreadsheet = await sheets.spreadsheets.get({
//       auth: authClient,
//       spreadsheetId,
//     });

//     // Log all sheet names for debugging
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

//     // Get all data from the sheet (extended range to include all columns)
//     const response = await sheets.spreadsheets.values.get({
//       auth: authClient,
//       spreadsheetId,
//       range: `${sheetName}!A:BJ`, // Extended range to include all columns
//     });

//     const rows = response.data.values;
//     if (!rows || rows.length === 0) {
//       console.log('No data found in sheet');
//       return null;
//     }

//     // Log first row headers for verification
//     console.log('Headers:', rows[0]);

//     // Find column indexes dynamically based on headers
//     const headers = rows[0].map(h => h.toString().toLowerCase());
    
//     // Email is in column C (index 2)
//     const emailColIndex = 2;
    
//     // Find score columns (note the typo in "Comphrehensive")
//     const cumulativeColIndex = headers.findIndex(h => h.includes('cumulative %'));
//     const comprehensiveColIndex = headers.findIndex(h => h.includes('comphrehensive %')); // Note the typo
//     const investigativeColIndex = headers.findIndex(h => h.includes('investigative %'));
//     const analyticalColIndex = headers.findIndex(h => h.includes('analytical %'));

//     console.log('Found columns:', {
//       email: emailColIndex,
//       cumulative: cumulativeColIndex,
//       comprehensive: comprehensiveColIndex,
//       investigative: investigativeColIndex,
//       analytical: analyticalColIndex
//     });

//     // Verify we found all required columns
//     if (cumulativeColIndex === -1 || comprehensiveColIndex === -1 || 
//         investigativeColIndex === -1 || analyticalColIndex === -1) {
//       console.error('Missing required score columns');
//       return null;
//     }

//     // Find the row with matching email
//     for (let i = 1; i < rows.length; i++) {
//       const row = rows[i];
//       if (row[emailColIndex] && 
//           row[emailColIndex].toString().trim().toLowerCase() === clientEmail.trim().toLowerCase()) {
//         console.log('Found matching row:', row);
        
//         // Extract and parse scores
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
//     console.error('Google Sheets API error:', err.message);
//     if (err.response) {
//       console.error('API response error:', JSON.stringify(err.response.data, null, 2));
//     }
//     return null;
//   }
// }
// app.get('/test-sheet', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with actual email from sheet
//     const scores = await getScoresFromNewSheet(testEmail);
    
//     if (!scores) {
//       return res.status(404).json({ 
//         error: 'No scores found',
//         message: 'Make sure the email exists in the sheet and columns are correct'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Successfully fetched scores from Google Sheet',
//       scores
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: 'Failed to fetch scores',
//       details: err.message
//     });
//   }
// });

// app.get('/test-sheet-connection', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with an email from your sheet
//     const scores = await getScoresFromNewSheet(testEmail);
    
//     if (!scores) {
//       return res.status(404).json({ error: 'No scores found for test email' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Successfully connected to Google Sheets',
//       scores
//     });
//   } catch (err) {
//     console.error('Test connection error:', err);
//     res.status(500).json({
//       error: 'Failed to connect to Google Sheets',
//       details: err.message
//     });
//   }
// });

// app.post('/api/clients', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const { name, email } = req.body;
    
//     const client = new Client({
//       name,
//       email,
//       googleFormLink: `https://docs.google.com/forms/d/e/1FAIpQLScVX1hndMaUFpQgPjG2EXcCimYhMTFNR-8t5QdVV1kr9flNAQ/viewform?usp=pp_url&entry.1234567890=${encodeURIComponent(email)}`,
//       createdBy: req.user.userId
//     });
    
//     await client.save();
    
//     // Send email to client
//     const emailSubject = 'Please complete your handwriting analysis questionnaire';
//     const emailHtml = `
//       <p>Dear ${name},</p>
//       <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
//       <a href="${client.googleFormLink}">Click here to complete the questionnaire</a>
//       <p>Thank you!</p>
//     `;
    
//     await sendEmail(email, emailSubject, emailHtml);
    
//     res.status(201).json(client);
//   } catch (err) {
//     console.error('Error creating client:', err);
//     res.status(500).json({ error: 'Failed to create client' });
//   }
// });


// // Get client by email
// app.get('/api/clients/:email', async (req, res) => {
//   try {
//     const client = await Client.findOne({ email: req.params.email });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }
    
//     // Check if we have questionnaire scores
//     if (!client.questionnaireScores) {
//       // Try to fetch from Google Sheets
//       await checkGoogleFormResponse(client);
//     }
    
//     res.json(client);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch client' });
//   }
// });
// app.get('/api/clients', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const clients = await Client.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
//     res.json(clients);
//   } catch (err) {
//     console.error('Error fetching clients:', err);
//     res.status(500).json({ error: 'Failed to fetch clients' });
//   }
// });
// app.get('/api/clients/:id', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const client = await Client.findOne({ 
//       _id: req.params.id, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }
    
//     res.json(client);
//   } catch (err) {
//     console.error('Error fetching client:', err);
//     res.status(500).json({ error: 'Failed to fetch client' });
//   }
// });
// // Check for form responses
// app.get('/api/clients/:id/check-responses', authenticateToken, async (req, res) => {
//   // Add timeout handling
//   const timeoutPromise = new Promise((_, reject) => {
//     setTimeout(() => {
//       reject(new Error('Database operation timed out'));
//     }, 8000); // Reject after 8 seconds
//   });

//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     // Race the DB query against our timeout
//     const client = await Promise.race([
//       Client.findOne({ 
//         _id: req.params.id, 
//         createdBy: req.user.userId 
//       }),
//       timeoutPromise
//     ]);

//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     // Get scores from Google Sheet with timeout
//     const scores = await Promise.race([
//       getScoresFromNewSheet(client.email),
//       timeoutPromise
//     ]);

//     if (scores) {
//       const updateOperation = Promise.race([
//         Client.findByIdAndUpdate(
//           req.params.id,
//           { 
//             questionnaireScores: scores,
//             combinedScores: calculateCombinedScores(client.scriptScores, scores, client.weight)
//           },
//           { new: true }
//         ),
//         timeoutPromise
//       ]);

//       const updatedClient = await updateOperation;
      
//       return res.json({ 
//         updated: true,
//         client: updatedClient
//       });
//     }
    
//     res.json({ updated: false });
//   } catch (err) {
//     console.error('Error checking responses:', err.message);
    
//     // Specific error messages
//     if (err.message.includes('timed out')) {
//       return res.status(504).json({ 
//         error: 'Database timeout',
//         message: 'The operation took too long to complete'
//       });
//     }
    
//     res.status(500).json({ 
//       error: 'Failed to check responses',
//       details: err.message 
//     });
//   }
// });
// app.get('/health', async (req, res) => {
//   try {
//     // Simple ping to check if DB is responsive
//     await mongoose.connection.db.admin().ping();
//     res.json({
//       status: 'healthy',
//       database: 'connected',
//       timestamp: new Date()
//     });
//   } catch (err) {
//     res.status(503).json({
//       status: 'unhealthy',
//       database: 'disconnected',
//       error: err.message
//     });
//   }
// });
// // Helper function
// function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
//   if (!scriptScores || !questionnaireScores) return null;
  
//   const combined = {};
//   Object.keys(scriptScores).forEach(key => {
//     const scriptValue = scriptScores[key] || 0;
//     const questionnaireValue = questionnaireScores[key] || 0;
//     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
//   });
  
//   return combined;
// }
// // Update client (e.g., adjust weights)
// // Make sure your client routes include proper authentication
// app.put('/api/clients/:id', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const { weight, scriptScores } = req.body;
    
//     const client = await Client.findOne({ 
//       _id: req.params.id, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     // Get updated scores from Google Sheet
//     const questionnaireScores = await getScoresFromNewSheet(client.email);
    
//     const updatedClient = await Client.findByIdAndUpdate(
//       req.params.id,
//       {
//         weight,
//         scriptScores,
//         questionnaireScores,
//         combinedScores: calculateCombinedScores(scriptScores, questionnaireScores, weight)
//       },
//       { new: true }
//     );
    
//     res.json(updatedClient);
//   } catch (err) {
//     console.error('Error updating client:', err);
//     res.status(500).json({ error: 'Failed to update client' });
//   }
// });
// app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const client = await Client.findOneAndDelete({ 
//       _id: req.params.id, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }
    
//     res.json({ message: 'Client deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting client:', err);
//     res.status(500).json({ error: 'Failed to delete client' });
//   }
// });

// // Helper function to check Google Form responses
// async function checkGoogleFormResponse(client) {
//   try {
//     const authClient = await auth.getClient();
//     const spreadsheetId = '1XBLry0OaK5PPZbWJBaEPPI1_563WAkc8svQthekemUU';
//     const range = 'Form Responses 2';
    
//     const response = await sheets.spreadsheets.values.get({
//       auth: authClient,
//       spreadsheetId,
//       range,
//     });
    
//     const rows = response.data.values;
//     if (!rows || rows.length === 0) return;
    
//     // Find the row with matching email
//     const headers = rows[0];
//     const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
//     const timestampIndex = headers.findIndex(h => h.toLowerCase().includes('timestamp'));
    
//     if (emailIndex === -1) return;
    
//     for (let i = 1; i < rows.length; i++) {
//       const row = rows[i];
//       if (row[emailIndex] === client.email) {
//         // Found the response - calculate scores
//         const scores = calculateQuestionnaireScores(row, headers);
        
//         // Update client record
//         client.questionnaireScores = scores;
//         client.googleFormResponseId = row[timestampIndex];
//         client.combinedScores = calculateCombinedScores(
//           client.scriptScores,
//           scores,
//           client.weight
//         );
        
//         await client.save();
//         break;
//       }
//     }
//   } catch (err) {
//     console.error('Error checking Google Form responses:', err);
//   }
// }

// // Helper function to calculate questionnaire scores from form responses
// function calculateQuestionnaireScores(row, headers) {
//   // This should implement your Excel sheet calculations
//   // Here's a simplified example - adjust based on your actual calculations
  
//   // Find indices of relevant questions
//   const cumulativeIndices = [/* indices of cumulative questions */];
//   const investigativeIndices = [/* indices of investigative questions */];
//   const comprehensiveIndices = [/* indices of comprehensive questions */];
//   const analyticalIndices = [/* indices of analytical questions */];
  
//   // Calculate scores (this is simplified - use your actual calculation logic)
//   const cumulativeScore = calculateSectionScore(row, cumulativeIndices);
//   const investigativeScore = calculateSectionScore(row, investigativeIndices);
//   const comprehensiveScore = calculateSectionScore(row, comprehensiveIndices);
//   const analyticalScore = calculateSectionScore(row, analyticalIndices);
  
//   return {
//     Cumulative: cumulativeScore,
//     Investigative: investigativeScore,
//     Comprehensive: comprehensiveScore,
//     Analytical: analyticalScore
//   };
// }

// function calculateSectionScore(row, indices) {
//   let total = 0;
//   let count = 0;
  
//   for (const index of indices) {
//     if (row[index]) {
//       total += parseInt(row[index]) || 0;
//       count++;
//     }
//   }
  
//   return count > 0 ? Math.round((total / (count * 5)) * 100) : 0; // Assuming 5-point scale
// }

// function calculateCombinedScores(scriptScores, questionnaireScores, weight) {
//   const combined = {};
  
//   if (!scriptScores || !questionnaireScores) return null;
  
//   Object.keys(scriptScores).forEach(key => {
//     const scriptValue = scriptScores[key] || 0;
//     const questionnaireValue = questionnaireScores[key] || 0;
//     combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
//   });
  
//   return combined;
// }
// app.get('/test-new-sheet', async (req, res) => {
//   try {
//     const testEmail = 'test@example.com'; // Replace with an email from your sheet
//     const scores = await getScoresFromNewSheet(testEmail);
    
//     if (!scores) {
//       return res.status(404).json({ error: 'No scores found for test email' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Successfully connected to new Google Sheet',
//       scores
//     });
//   } catch (err) {
//     console.error('Test connection error:', err);
//     res.status(500).json({
//       error: 'Failed to connect to Google Sheet',
//       details: err.message
//     });
//   }
// });
// // Add this endpoint to your server.js
// app.post('/api/refresh-token', authenticateToken, async (req, res) => {
//   try {
//     let user;
//     if (req.user.role === 'user') {
//       user = await User.findById(req.user.userId);
//     } else if (req.user.role === 'admin') {
//       user = await Admin.findById(req.user.adminId);
//     }

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const token = jwt.sign(
//       req.user.role === 'user' 
//         ? { userId: user._id, email: user.email, role: 'user' }
//         : { adminId: user._id, email: user.email, role: 'admin' },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({ token });
//   } catch (error) {
//     console.error('Token refresh error:', error);
//     res.status(500).json({ error: 'Failed to refresh token' });
//   }
// });
// // Send form to client
// app.post('/api/clients/send-form', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ error: 'User access required' });
//     }

//     const { clientId } = req.body;
    
//     const client = await Client.findOne({ 
//       _id: clientId, 
//       createdBy: req.user.userId 
//     });
    
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     // Send email to client with the form link
//     const emailSubject = 'Please complete your handwriting analysis questionnaire';
//     const emailHtml = `
//       <p>Dear ${client.name},</p>
//       <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
//       <a href="${client.googleFormLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Click here to complete the questionnaire</a>
//       <p><strong>Link:</strong> ${client.googleFormLink}</p>
//       <p>Thank you!</p>
//     `;
    
//     await sendEmail(client.email, emailSubject, emailHtml);
    
//     res.json({ 
//       message: 'Form sent successfully to client',
//       client: {
//         id: client._id,
//         name: client.name,
//         email: client.email
//       }
//     });
//   } catch (err) {
//     console.error('Error sending form:', err);
//     res.status(500).json({ error: 'Failed to send form to client' });
//   }
// });
// // //////////////////////////////////////////////////////////////////////////////////////////////


// app.post('/api/refresh-token', authenticateToken, async (req, res) => {
//   try {
//     let user;
//     if (req.user.role === 'user') {
//       user = await User.findById(req.user.userId);
//     } else if (req.user.role === 'admin') {
//       user = await Admin.findById(req.user.adminId);
//     }

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const token = jwt.sign(
//       req.user.role === 'user' 
//         ? { userId: user._id, email: user.email, role: 'user' }
//         : { adminId: user._id, email: user.email, role: 'admin' },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({ token });
//   } catch (error) {
//     console.error('Token refresh error:', error);
//     res.status(500).json({ error: 'Failed to refresh token' });
//   }
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/handwritting';
mongoose.connect(mongoURI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Brevo Configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'sagu20102004@gmail.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Grapho Genius';

// Validate environment variables
if (!BREVO_API_KEY) {
  console.warn('⚠️ BREVO_API_KEY is not set in environment variables. Emails will fail.');
}

// ============================================
// BREVO EMAIL FUNCTIONS
// ============================================

const sendEmailViaBrevo = async (to, subject, htmlContent) => {
  try {
    if (!BREVO_API_KEY) {
      console.error('❌ Brevo API key not configured');
      return null;
    }

    const emailData = {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL
      },
      to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    };

    console.log(`📧 Sending email via Brevo to: ${to}, Subject: ${subject}`);

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('✅ Email sent successfully via Brevo');
    return response.data;
  } catch (error) {
    console.error('❌ Brevo API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    // Don't throw error, just log it
    console.log('⚠️ Email sending failed, continuing without email');
    return null;
  }
};

const sendEmailToMultiple = async (recipients, subject, htmlContent) => {
  try {
    if (!BREVO_API_KEY) {
      console.error('❌ Brevo API key not configured');
      return null;
    }

    const emailData = {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL
      },
      to: recipients.map(email => ({ email })),
      subject: subject,
      htmlContent: htmlContent
    };

    console.log(`📧 Sending email to ${recipients.length} recipients via Brevo`);

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log(`✅ Email sent successfully to ${recipients.length} recipients`);
    return response.data;
  } catch (error) {
    console.error('❌ Brevo API Error (multiple recipients):', error.response?.data?.message || error.message);
    console.log('⚠️ Email sending failed, continuing without email');
    return null;
  }
};

const sendEmail = async (to, subject, html) => {
  return await sendEmailViaBrevo(to, subject, html);
};

// ============================================
// TEST ENDPOINTS
// ============================================

app.get('/test-brevo', async (req, res) => {
  try {
    if (!BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'BREVO_API_KEY not configured in environment variables'
      });
    }

    const testEmail = req.query.email || 'test@example.com';
    
    const result = await sendEmailViaBrevo(
      testEmail,
      'Test Email from Brevo API - Handwriting System',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #4CAF50;">✅ Brevo Integration Test</h2>
        <p>If you receive this email, Brevo API is working correctly!</p>
        <p><strong>System:</strong> Handwriting Analysis Backend</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Status:</strong> <span style="color: green;">Operational</span></p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is a test email from your backend system.</p>
      </div>
      `
    );
    
    if (!result) {
      return res.status(500).json({
        success: false,
        error: 'Email sending failed (check Brevo configuration)'
      });
    }
    
    res.json({
      success: true,
      message: 'Test email sent via Brevo API',
      result
    });
  } catch (error) {
    console.error('Test failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      brevoConfigured: !!BREVO_API_KEY,
      serverTime: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      brevoConfigured: !!BREVO_API_KEY,
      error: err.message,
      serverTime: new Date().toISOString()
    });
  }
});

// ============================================
// DATABASE SCHEMAS
// ============================================

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
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
});

// Client Schema
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

// Create Models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const UserActivity = mongoose.model('UserActivity', userActivitySchema);
const Client = mongoose.model('Client', clientSchema);

// ============================================
// JWT CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production-12345';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Invalid or expired token' 
      });
    }
    req.user = decoded;
    next();
  });
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const logActivity = async (userId, action, req) => {
  try {
    await UserActivity.create({
      userId,
      action,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Create default admin (run this once)
app.get('/create-default-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existing = await Admin.findOne({ email: 'admin@example.com' });
    if (existing) {
      return res.json({
        success: true,
        message: 'Admin already exists.',
        admin: {
          email: existing.email,
          name: existing.name
        }
      });
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin
    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@example.com',
      mobile: '1234567890',
      department: 'IT',
      password: hashedPassword,
      isActive: true,
    });

    await admin.save();
    
    res.json({
      success: true,
      message: 'Default admin created successfully.',
      credentials: {
        email: 'admin@example.com',
        password: 'admin123'
      },
      note: 'Please change the password after first login.'
    });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({
      success: false,
      error: 'Error creating admin',
      details: err.message
    });
  }
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, mobile, role, otherRole } = req.body;

    // Validate input
    if (!name || !email || !mobile || !role) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: name, email, mobile, role'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create new user (without password initially)
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

    if (adminEmails.length > 0) {
      const emailSubject = 'New User Registration - Approval Required';
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📋 New User Registration</h2>
          <p>A new user has registered and requires your approval:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>📱 Mobile:</strong> ${mobile}</p>
            <p><strong>🎯 Role:</strong> ${role}${role === 'Other' ? ` (${otherRole})` : ''}</p>
            <p><strong>📅 Registration Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Please log in to the admin dashboard to approve or reject this user.</p>
          <a href="https://grapho-genius-ai.vercel.app/admin-login" 
             style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Go to Admin Dashboard
          </a>
        </div>
      `;

      await sendEmailToMultiple(adminEmails, emailSubject, emailHtml);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.',
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin Login (FIXED)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Admin login attempt: ${email}`);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ 
      email: email.trim().toLowerCase(),
      isActive: true 
    });
    
    if (!admin) {
      console.log(`❌ Admin not found: ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      console.log(`❌ Invalid password for admin: ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id.toString(),
        email: admin.email,
        role: 'admin',
        name: admin.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Admin login successful: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// User Login
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 User login attempt: ${email}`);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ 
      email: email.trim().toLowerCase()
    });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      console.log(`❌ User not verified: ${email}`);
      return res.status(403).json({
        success: false,
        error: 'Account not verified',
        message: 'Your account is pending admin approval. Please wait for verification.'
      });
    }

    // Check if user has password set
    if (!user.password) {
      console.log(`❌ No password set for user: ${email}`);
      return res.status(403).json({
        success: false,
        error: 'Password not set',
        message: 'Please contact administrator to set your password.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`❌ Invalid password for user: ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    await logActivity(user._id, 'login', req);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: 'user',
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ User login successful: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        otherRole: user.otherRole,
        mobile: user.mobile,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ User login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// Get pending user requests (Admin only)
app.get('/api/admin/pending-users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const pendingUsers = await User.find({ 
      isVerified: false,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers
    });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify user (Admin only)
app.post('/api/admin/verify-user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { userId } = req.params;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'User already verified'
      });
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
    const emailSubject = '🎉 Account Approved - Login Credentials';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">✅ Account Approved</h2>
        <p>Dear ${user.name},</p>
        
        <p>Your account has been approved by our admin team. You can now log in to the Handwriting Analysis System.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Login Credentials:</h3>
          <p><strong>📧 Email:</strong> ${user.email}</p>
          <p><strong>🔑 Temporary Password:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 3px;">${tempPassword}</code></p>
        </div>
        
        <p style="color: #dc3545; font-weight: bold;">
          ⚠️ IMPORTANT: Please change your password immediately after logging in for security.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://grapho-genius-ai.vercel.app/user-login" 
             style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
            🚀 Click here to Login
          </a>
        </div>
        
        <p>Welcome to the Handwriting Pattern Prediction System! We're excited to have you on board.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #6c757d;">
          This is an automated message. Please do not reply to this email.<br>
          If you have any questions, contact the system administrator.
        </p>
      </div>
    `;

    // Send email (non-blocking)
    sendEmailViaBrevo(user.email, emailSubject, emailHtml).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    res.json({
      success: true,
      message: 'User verified successfully. Login credentials have been sent via email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt
      },
      note: 'The user can now login with the temporary password sent to their email.'
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all users (Admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const users = await User.find()
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user activities (Admin only)
app.get('/api/admin/user-activities', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const activities = await UserActivity.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: activities.length,
      activities: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ============================================
// USER ROUTES
// ============================================

// User logout
app.post('/api/user/logout', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'user') {
      await logActivity(req.user.userId, 'logout', req);
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ============================================
// CLIENT ROUTES (Google Sheets Integration)
// ============================================

const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Google Sheets Authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Function to get scores from Google Sheets
async function getScoresFromNewSheet(clientEmail) {
  try {
    const authClient = await auth.getClient();
    const spreadsheetId = '1oYSj9bU3b5g-CzSCESbg8RAvuzj0dhXHdODRl_GhSno';
    
    // Get spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      auth: authClient,
      spreadsheetId,
    });

    // Find the correct sheet
    const sheetNames = spreadsheet.data.sheets.map(s => s.properties.title);
    console.log('Available sheets:', sheetNames);

    const targetSheet = spreadsheet.data.sheets.find(s => 
      s.properties.title.toLowerCase().includes('form responses 2')
    );

    if (!targetSheet) {
      console.error('No matching sheet found');
      return null;
    }

    const sheetName = targetSheet.properties.title;
    console.log(`Using sheet: ${sheetName}`);

    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: `${sheetName}!A:BJ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in sheet');
      return null;
    }

    // Find column indexes
    const headers = rows[0].map(h => h.toString().toLowerCase());
    const emailColIndex = 2; // Column C
    
    const cumulativeColIndex = headers.findIndex(h => h.includes('cumulative %'));
    const comprehensiveColIndex = headers.findIndex(h => h.includes('comphrehensive %'));
    const investigativeColIndex = headers.findIndex(h => h.includes('investigative %'));
    const analyticalColIndex = headers.findIndex(h => h.includes('analytical %'));

    // Verify columns exist
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
    return null;
  }
}

// Helper function to calculate combined scores
function calculateCombinedScores(scriptScores, questionnaireScores, weight = 50) {
  if (!scriptScores || !questionnaireScores) return null;
  
  const combined = {};
  Object.keys(scriptScores).forEach(key => {
    const scriptValue = scriptScores[key] || 0;
    const questionnaireValue = questionnaireScores[key] || 0;
    combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
  });
  
  return combined;
}

// Create new client
app.post('/api/clients', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Client name and email are required'
      });
    }

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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Handwriting Analysis Questionnaire</h2>
        <p>Dear ${name},</p>
        <p>Please complete the following questionnaire as part of your handwriting analysis:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${client.googleFormLink}" 
             style="display: inline-block; padding: 12px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            📝 Complete Questionnaire
          </a>
        </div>
        
        <p>Or copy and paste this link in your browser:</p>
        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; border: 1px solid #dee2e6; word-break: break-all;">
          ${client.googleFormLink}
        </div>
        
        <p style="margin-top: 20px;">Thank you for your participation!</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #6c757d;">
          This email was sent from Grapho Genius handwriting analysis system.
        </p>
      </div>
    `;
    
    await sendEmailViaBrevo(email, emailSubject, emailHtml);
    
    res.status(201).json({
      success: true,
      message: 'Client created and email sent successfully',
      client: client
    });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create client',
      details: err.message
    });
  }
});

// Get all clients for logged-in user
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const clients = await Client.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: clients.length,
      clients: clients
    });
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clients'
    });
  }
});

// Get specific client by ID
app.get('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const client = await Client.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    res.json({
      success: true,
      client: client
    });
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch client'
    });
  }
});

// Check for form responses
app.get('/api/clients/:id/check-responses', authenticateToken, async (req, res) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, 8000);
  });

  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const client = await Promise.race([
      Client.findOne({ 
        _id: req.params.id, 
        createdBy: req.user.userId 
      }),
      timeoutPromise
    ]);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    const scores = await Promise.race([
      getScoresFromNewSheet(client.email),
      timeoutPromise
    ]);

    if (scores) {
      const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        { 
          questionnaireScores: scores,
          combinedScores: calculateCombinedScores(client.scriptScores, scores, client.weight)
        },
        { new: true }
      );
      
      return res.json({
        success: true,
        updated: true,
        client: updatedClient
      });
    }
    
    res.json({
      success: true,
      updated: false,
      message: 'No new responses found'
    });
  } catch (err) {
    console.error('Error checking responses:', err.message);
    
    if (err.message.includes('timed out')) {
      return res.status(504).json({
        success: false,
        error: 'Request timeout',
        message: 'The operation took too long to complete'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to check responses',
      details: err.message 
    });
  }
});

// Update client (adjust weights, add script scores)
app.put('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const { weight, scriptScores } = req.body;
    
    const client = await Client.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Get updated scores from Google Sheet
    const questionnaireScores = await getScoresFromNewSheet(client.email);
    
    const updateData = {
      weight: weight !== undefined ? weight : client.weight,
      scriptScores: scriptScores || client.scriptScores,
      questionnaireScores: questionnaireScores || client.questionnaireScores
    };

    // Calculate combined scores if both script and questionnaire scores exist
    if (updateData.scriptScores && updateData.questionnaireScores) {
      updateData.combinedScores = calculateCombinedScores(
        updateData.scriptScores, 
        updateData.questionnaireScores, 
        updateData.weight
      );
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Client updated successfully',
      client: updatedClient
    });
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update client'
    });
  }
});

// Delete client
app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const client = await Client.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete client'
    });
  }
});

// Send form to client (resend)
app.post('/api/clients/send-form', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        success: false,
        error: 'User access required'
      });
    }

    const { clientId } = req.body;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: 'Client ID is required'
      });
    }

    const client = await Client.findOne({ 
      _id: clientId, 
      createdBy: req.user.userId 
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Send email to client
    const emailSubject = 'Reminder: Complete your handwriting analysis questionnaire';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Handwriting Analysis - Reminder</h2>
        <p>Dear ${client.name},</p>
        <p>This is a friendly reminder to complete your handwriting analysis questionnaire:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${client.googleFormLink}" 
             style="display: inline-block; padding: 12px 30px; background-color: #17a2b8; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            📝 Complete Questionnaire Now
          </a>
        </div>
        
        <p><strong>Direct Link:</strong></p>
        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; border: 1px solid #dee2e6; word-break: break-all;">
          ${client.googleFormLink}
        </div>
        
        <p style="margin-top: 20px;">Thank you for your participation!</p>
      </div>
    `;
    
    await sendEmailViaBrevo(client.email, emailSubject, emailHtml);
    
    res.json({
      success: true,
      message: 'Form sent successfully to client',
      client: {
        id: client._id,
        name: client.name,
        email: client.email
      }
    });
  } catch (err) {
    console.error('Error sending form:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send form to client'
    });
  }
});

// Test Google Sheets connection
app.get('/test-sheet', async (req, res) => {
  try {
    const testEmail = req.query.email || 'test@example.com';
    const scores = await getScoresFromNewSheet(testEmail);
    
    if (!scores) {
      return res.status(404).json({
        success: false,
        error: 'No scores found',
        message: 'Make sure the email exists in the sheet and columns are correct'
      });
    }
    
    res.json({
      success: true,
      message: 'Successfully fetched scores from Google Sheet',
      scores: scores
    });
  } catch (err) {
    console.error('Error testing sheet:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scores',
      details: err.message
    });
  }
});

// ============================================
// TOKEN REFRESH ROUTE
// ============================================

app.post('/api/refresh-token', authenticateToken, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'user') {
      user = await User.findById(req.user.userId);
    } else if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.adminId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const token = jwt.sign(
      req.user.role === 'user' 
        ? { userId: user._id, email: user.email, role: 'user', name: user.name }
        : { adminId: user._id, email: user.email, role: 'admin', name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh token'
    });
  }
});
// Add this route BEFORE the existing /create-default-admin route
app.get('/create-my-admin', async (req, res) => {
  try {
    const adminEmail = '01fe22bcs259@kletech.ac.in';
    const adminPassword = 'admin123'; // Change this to your desired password
    
    // Check if admin already exists
    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      // Update password if exists
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existing.password = hashedPassword;
      await existing.save();
      
      return res.json({
        success: true,
        message: 'Admin account updated with new password',
        credentials: {
          email: adminEmail,
          password: adminPassword
        }
      });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new Admin({
      name: 'Your Admin',
      email: adminEmail,
      mobile: '1234567890',
      department: 'IT',
      password: hashedPassword,
      isActive: true,
    });

    await admin.save();
    
    res.json({
      success: true,
      message: 'Admin created successfully',
      credentials: {
        email: adminEmail,
        password: adminPassword
      }
    });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({
      success: false,
      error: 'Error creating admin',
      details: err.message
    });
  }
});
app.get('/debug-admins', async (req, res) => {
  try {
    const admins = await Admin.find({});
    
    // Return admin info (without password)
    const adminList = admins.map(admin => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin
    }));
    
    res.json({
      success: true,
      count: admins.length,
      admins: adminList
    });
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get('/reset-admin-password', async (req, res) => {
  try {
    const adminEmail = '01fe22bcs259@kletech.ac.in';
    const newPassword = 'admin123'; // Set your desired password
    
    const admin = await Admin.findOne({ email: adminEmail });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }
    
    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    
    res.json({
      success: true,
      message: 'Password reset successfully',
      credentials: {
        email: adminEmail,
        password: newPassword
      }
    });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment Status:`);
  console.log(`   - MongoDB: ${mongoURI ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   - Brevo API: ${BREVO_API_KEY ? '✅ Configured' : '⚠️ NOT CONFIGURED (emails will fail)'}`);
  console.log(`   - JWT Secret: ${JWT_SECRET !== 'your-secret-key-change-this-in-production-12345' ? '✅ Custom' : '⚠️ Default (change in production)'}`);
  console.log(`   - Admin Login: https://handwritingbackendnode.onrender.com/create-default-admin`);
  console.log(`   - Health Check: https://handwritingbackendnode.onrender.com/health`);
});
