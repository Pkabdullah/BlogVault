const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../utils/authentication");
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "/images.jpeg",
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassowrd = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassowrd;
  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
 
  if (!user) return false
  const salt = user.salt;
  const hashedpassword = user.password;
  const userHashed = createHmac("sha256", salt)
  .update(password)
  .digest("hex");

    if (hashedpassword !== userHashed) 
        throw new Error("InCorrect Password");
    // return user
    const token= createTokenForUser(user)
    return token
});
const User = mongoose.model("User", userSchema);
module.exports = User;
