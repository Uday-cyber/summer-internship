const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const { username, email, mobile, password } = req.body;
    
    try {
        const newUser = new User({ username, email, mobile, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user', details: error });
    }
});

module.exports = router;
