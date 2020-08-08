const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    avatarUrl: String, 
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: String,
    status: {
      type: String,
      required: true,
      enum: ['Verified', 'Not verified'],
      default: 'Not verified',
    },
    verificationToken: String,
  },
  { versionKey: false }
);

class User {
  constructor() {
    this.user = mongoose.model("User", userSchema);
  }
  getUsers = async (query = {}) => {
    return await this.user.findOne(query);
  };

  getUserById = async (id) => {
    return await this.user.findById(id);
  };

  createUser = async (data) => {
    return await this.user.create(data);
  };

  deleteUserById = async (id) => {
    return await this.user.findByIdAndDelete(id);
  };

  updateUser = async (id, data) => {
    return await this.user.findByIdAndUpdate(id, data, { new: true });
  };

  getUserByVerificationToken= async(verificationToken) =>{
    return await this.user.findOne({ verificationToken });
  }
  
 verificatedUser = async(email) =>{
    return await this.user.updateOne(
      { email },
      { verificationToken: null, status: 'Verified', }
    );
  }

}

module.exports = new User();
