const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: String,
  },
  { versionKey: false }
);

class User {
  constructor() {
    this.user = mongoose.model("User", userSchema);
  }
  getUsers = async (query = {}) => {
    return await this.user.find(query);
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
}

module.exports = new User();
