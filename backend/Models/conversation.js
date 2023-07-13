// const mongoose = require("mongoose");

// const conversationSchema = new mongoose.Schema({
//   members : {
//     type : Array
//   },
// },
// {timestamps : true},
// );

// module.exports = mongoose.model("Conversation", conversationSchema) ;

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  chatName: {
    type: String,
    required: [true, "chatName is required field."],
    maxlength:200,
    trim:true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
latestMessage: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Message",
},
groupAdmin:{
  type : mongoose.Schema.Types.ObjectId,
  ref: "User",
},
},
{
  timestamps: true,
}
);

const Chat = mongoose.model('Chat', conversationSchema);
module.exports = Chat ;