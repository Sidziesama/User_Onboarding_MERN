require('dotenv').config();

/** Initialzing necessary packages..
 * This function establishes the connection to the database and launces the server.
 * It is the main driver function.
 */
const express = require('express');
const cors = require('cors');

const connection = require('./databse/db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const passwordResetRoutes = require('./routes/passwordReset') ;

const app = express();

// Connection 
connection() ;

// Middleware 

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reset-password", passwordResetRoutes);


const PORT = process.env.PORT || 8080 ;

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
})

