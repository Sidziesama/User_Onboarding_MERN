// const router = require("express").Router() ; 
// const Message = require ("../Models/message");

// // add 

// router.post('/',async(req,res)=>{
//   const newMessage = new Message (req.body) ;
  
//   try {
//     const savedMessage = await newMessage.save();
//     res.status(200).json(savedMessage);
//   }
//   catch(err){
//     res.status(500).json(err);
//   }
// });

// router.get('/:conversationID',async(req,res)=>{
//   try {
//     const messages = await Message.find ({
//       conversationID :req.params.conversationID ,
//     });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// })
// module.exports = router ;

const router = require("express").Router();
const auth = require("../Middlewares/authMiddleware");
const {
  sendMessage,
  fetchMessage,
} = require("../controllers/messageControllers");

// Route to send the message to the recipient
router.route("/").post(auth, sendMessage);
// Route to retrieve all the message
router.route("/:chatId").get(auth, fetchMessage);

module.exports = router;