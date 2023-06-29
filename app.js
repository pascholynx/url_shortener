const express = require('express');
const connectDB = require('./db');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const urlRoutes = require('./routes/url');
const userRoutes = require('./routes/user');
const path = require('path');



const app = express();
const port = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
 res.status(404).sendFile(path.join(__dirname, '/public/myHTML/404.html'));
});

const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 10, // limit each IP to 10 requests per windowMs
});

//  apply to all requests
app.use(limiter); 
app.use(express.json()); // for parsing application/json
app.use(cookieParser());
app.use('/api', urlRoutes);
app.use('/user', userRoutes);


app.get('/', (req, res) => {
 res.send('Welcome to Scissor, My Url Shortner site!');
});


app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`);
});
