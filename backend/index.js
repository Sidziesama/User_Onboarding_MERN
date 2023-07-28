require('dotenv').config();

/** Initialzing necessary packages..
 * This function establishes the connection to the database and launces the server.
 * It is the main driver function.
 */
const express = require('express');
const cors = require('cors');
const colors = require('colors');

const connection = require('./databse/db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
// const conversationRoutes = require('./routes/conversations');
// const messageRoutes = require('./routes/messages');
const passwordResetRoutes = require('./routes/passwordReset') ;
const conversationRoutes = require("./routes/conversations");
const messageRoutes = require("./routes/messages");

const app = express();

// Connection 
connection() ;

// Middleware 

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/forgot-password", passwordResetRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);


const PORT = process.env.PORT || 8080 ;

const server = app.listen(PORT, () => {
  console.log(
    colors.brightMagenta(`\nServer is UP on PORT ${PORT}`)
  );
  console.log(`Visit  ` + colors.underline.blue(`localhost:${8080}`));
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Sockets are in action");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData.name, "connected");
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });
  socket.on("new message", (newMessage) => {
    var chat = newMessage.chatId;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

