// app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./router/auth');
const viewroute=require("./router/viewroute");
const paymentsroute=require("./router/transection");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // replace with your client origin
  credentials: true, // this allows cookies to be sent and received
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/",viewroute);
app.use('/api/auth', authRoutes);
app.use("/transection",paymentsroute);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});