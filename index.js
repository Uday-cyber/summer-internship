const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

// Call the MongoDB connection function
connectDB();

// User model
const User = require('./models/User'); // Ensure your User model is correctly set up

// Routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'Eduford-index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'Eduford-about.html'));
});

app.get('/course', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'Eduford-course.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'Eduford-blog.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'Eduford-contact.html'));
});

// Route to handle user registration (POST request)
app.post('/register', async (req, res) => {
    const { username, email, mobile, password } = req.body;

    try {
        // Validate the form data
        if (!username || !email || !mobile || !password) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user
        const newUser = new User({
            username,
            email,
            mobile,
            password: hashedPassword, // Store the hashed password
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to handle user login (POST request)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate the form data
        if (!email || !password) {
            return res.status(400).send('Please fill in all fields.');
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Email does not exist.'); // User not found
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Incorrect password.'); // Password mismatch
        }

        // Successful login
        res.status(200).json({ message: 'Login successful!', user }); // Send success response with user data
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error'); // General server error
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
