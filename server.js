require('dotenv').config();
require("./config/mysql");
const express = require('express');
const connectDB = require('./config/db');
const {apiLimiter} = require('./middleware/rateLimiter');
const getClientIp = require('./middleware/getClientIp');
const path = require("path");
const helmet = require('helmet');
const cors = require('cors');
const cookieParser =require ('cookie-parser')


const app = express();


//connect database
connectDB();


//body paser
app.use(express.json({extended: false}));
app.use(cookieParser())


// Extract client IP for all routes
app.use(getClientIp);

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

//root route 
app.get('/api/', (req, res) => res.send({msg: 'Welcome to Inventory Management API...'}));


//Define routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/suppliers',require('./routes/supplier'));
app.use('/api/categories',require('./routes/category'));
app.use('/api/products',require('./routes/product'));
app.use('/api/sales',require('./routes/sales'));
app.use('/api/reports',require('./routes/report'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on:${PORT}`));
