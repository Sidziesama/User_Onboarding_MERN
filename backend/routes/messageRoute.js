// const router = require("express").Router();

// const Message = require("../Models/messageModel");

// //add

// router.post("/", async (req, res) => {
//   const newMessage = new Message(req.body);

//   try {
//     const savedMessage = await newMessage.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //get

// router.get("/:conversationId", async (req, res) => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;

const router = require("express").Router();
const auth = require("../utilities/authenticateToken");
const {
  sendMessage,
  fetchMessage,
} = require("../controller/messageController");

// Route to send the message to the recipient
router.route("/").post(auth, sendMessage);
// Route to retrieve all the message
router.route("/:chatId").get(auth, fetchMessage);

module.exports = router;