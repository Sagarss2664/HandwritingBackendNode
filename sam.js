const express = require('express');
const mongoose = require('mongoose');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/handwritting';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '01fe22bcs259@kletech.ac.in',
    pass: 'swzk lukh byrh xema',
  }
});
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

// Google Sheets API setup
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // You'll need to create this (see step 2)
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// API Endpoints

// Create new client and send form
// Create client (User only)
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
    
    // Implement your Google Sheets integration here
    // This is a placeholder - you'll need to add your actual logic
    const hasNewResponses = false; // Replace with actual check
    
    if (hasNewResponses) {
      // Update client with new scores
      const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        { $set: { questionnaireScores: {}, combinedScores: {} } }, // Replace with actual scores
        { new: true }
      );
      
      return res.json({ 
        updated: true,
        client: updatedClient
      });
    }
    
    res.json({ updated: false });
  } catch (err) {
    console.error('Error checking responses:', err);
    res.status(500).json({ error: 'Failed to check responses' });
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
app.put('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }

    const { weight, scriptScores, questionnaireScores } = req.body;
    
    const client = await Client.findOneAndUpdate(
      { 
        _id: req.params.id, 
        createdBy: req.user.userId 
      },
      {
        weight,
        scriptScores,
        questionnaireScores,
        combinedScores: calculateCombinedScores(scriptScores, questionnaireScores, weight)
      },
      { new: true }
    );
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
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
    const range = 'Form Responses 1!A:Z';
    
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));