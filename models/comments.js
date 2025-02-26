const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
  blogId: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{timestamps:true});
const Comment = mongoose.model("comment",commentSchema)
module.exports = Comment