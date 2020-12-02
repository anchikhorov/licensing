const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  orgname: { type: String, required: true },
  country: { type: String, required: true },
  email: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  // appname: { type: String, required: true },
  locality: { type: String, required: true },
  street: { type: String, required: true },
  house: { type: String, required: true },
  phone: { type: String, required: true },
  creator: { type: String, required: true },
  gendatetime: { type: String, required: true },
  //creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Customer", customerSchema);
