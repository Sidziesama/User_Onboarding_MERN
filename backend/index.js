
/** This is the main driver function.
 * This function establishes the connection to the database and launces the server.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const colors = require('colors');

const connection = require('./databse/db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const passwordResetRoutes = require('./routes/passwordReset');
const ChatRoute =require('./routes/conversationRoute') ;
const MessageRoute =require('./routes/messageRoute'); 


const app = express();

// Connection 
connection();

// Middleware 
app.use(express.json());
app.use(cors());


// Routes
/** Route URLs
 * {POST Call} Sign Up Route - http://localhost:8080/api/signup 
 * {POST Call} Sign Up Email Verification Route - http://localhost:8080/api/signup/verification 
 * {POST Call} Login Route - http://localhost:8080/api/login 
 * {POST Call} Forgot Password Route -http://localhost:8080/api/forgot-password 
 * {POST Call} Forgot Password OTP Verification Route -http://localhost:8080/api/forgot-password/verification 
 * {PUT Call} Reset Password Route -http://localhost:8080/api/forgot-password/reset-password  ; Make sure to put the JWT in the header 
 */
app.use("/api/signup", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/forgot-password", passwordResetRoutes);
app.use("/api/conversation", ChatRoute);
app.use("/api/message", MessageRoute);


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(
    colors.brightMagenta(`\nServer is UP on PORT ${PORT}`)
  );
  console.log(`Visit  ` + colors.underline.blue(`localhost:${8080}`));
});

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors: {
    origin : 'https://localhost3000',
  },
});

io.on("Connection", (socket)=>{
  console.log("Connected to socket.io")
});

