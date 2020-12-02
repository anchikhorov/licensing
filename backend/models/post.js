const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  orgname: { type: String, required: true },
  email: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  appname: { type: String, required: true },
  appversion: { type: String, required: true },
  licversion: { type: String, required: true },
  expdate: { type: String, required: true },
  licensefile: { type: String, required: true },
  hostid: {type: String, required: true },
  creator: { type: String, required: true },
  gendatetime: { type: String, required: true },
  //creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
