const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://uday:Uday09@merndb.yrp2b.mongodb.net/?retryWrites=true&w=majority&appName=mernDB"

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
