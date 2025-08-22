const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    required: true, 
    unique: true
   },
  password: {
    type: String, 
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  myPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

// Password encryption
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  console.log("Password encrypted successfully which is", this.password);
  next();
});

module.exports = mongoose.model("User", userSchema);
