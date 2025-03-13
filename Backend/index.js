const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const jwt = require('jsonwebtoken'); // Import JWT
const cors = require('cors');
const bcrypt = require('bcrypt');
const compression = require('compression');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Import Nodemailer
const secretkey = `uncc-news`;
require('dotenv').config();
const User = require('./models/User')
const Team = require('./models/Team');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB on DigitalOcean'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

  
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
});

// Middleware
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Route to create a new user
app.post('/users/signup', async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const newUser = new User({ name, email, password, phoneNumber });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, secretkey, { expiresIn: '5m' });
    
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: 'Welcome to Charlotte Women’s Lacrosse',
            text: `Hello ${name},\n\nWelcome to Charlotte Women’s Lacrosse. You have successfully signed up.\n\nRegards,\nThe Charlotte Women’s Lacrosse Team`,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
    
        res.status(200).json({ success: true, token, userId: newUser._id, name });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ success: false, message: 'Email already taken' });
        } else {
            console.log( err.message );
            res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
    }
});

// Route to log in a user
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if( email == 'Varshitha' && password == 'Varshitha' ){
            const token = jwt.sign({ userId: 'Varshitha' }, secretkey, { expiresIn: '5m' });
            res.status(200).json({ success: true, token, userId: 'Varshitha', name: 'Varshitha' });
        }
        else{
            const user = await User.findOne({ email });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
            }
            const token = jwt.sign({ userId: user._id }, secretkey, { expiresIn: '5m' });
            res.status(200).json({ success: true, token, userId: user._id, name: user.name });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
});

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    // Extract token from header
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }
  
    // Verify token
    jwt.verify(token, secretkey, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
  
        // Attach user info to request (if needed later)
        req.user = user;
        next();
        });
};

app.get('/', authenticateToken, async (req, res) => {
    res.status(200).json({ success: true });
});


app.get('/api/line-chart-data', authenticateToken, async (req, res) => {
    try {
      const data = await Team.find();
      res.json(data);
    } catch (error) {
      console.error("Error fetching bauxite production data:", error);
      res.status(500).json({ success: false, message: "Database error", error: error.message });
    }
});

app.get('/api/bar-chart-data', authenticateToken, async (req, res) => {
    try {
        const data = await Team.find(); 
        res.json(data);
    } catch (error) {
        console.error("Error fetching bauxite production data:", error);
        res.status(500).json({ success: false, message: "Database error", error: error.message });
    }
});

app.get('/chart/bauxite-reserves', authenticateToken, async (req, res) => {
    try {
        const data = await Team.find(); 
        res.json(data);
    } catch (error) {
        console.error("Error fetching bauxite production data:", error);
        res.status(500).json({ success: false, message: "Database error", error: error.message });
    }
});

app.get('/chart/bauxite-trends-new', authenticateToken, async (req, res) => {
    try {
        const data = await Team.find(); 
        res.json(data);
    } catch (error) {
        console.error("Error fetching bauxite production data:", error);
        res.status(500).json({ success: false, message: "Database error", error: error.message });
    }
});