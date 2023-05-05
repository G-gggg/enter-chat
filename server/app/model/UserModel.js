const mongoose = require("mongoose");
let userModel = mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    nickname: String,
    email: String,
    createTime: {
      type: Number,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "/default-avatar.png",
    },
    des: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    applyFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    blacklist: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

let UserModel = mongoose.model("user", userModel);

module.exports = UserModel;
