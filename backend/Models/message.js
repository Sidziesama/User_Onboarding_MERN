// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({

//   conversationID: {
//     type: String,
//   },
//   sender : {
//     type : String,
//   },
//   text : {
//     type : String,
//   }
// },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Message", messageSchema);

const mongoose = require ("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  content: {
    type: String,
    trim:true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
},
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
module.exports=Message;