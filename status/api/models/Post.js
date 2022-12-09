const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types
const PostSchema = new mongoose.Schema(
  {
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoincreament : true,
    //   required: true,
    //   unique: true,
     
    // },
    title: {
      type: String,
      required: true,
      unique: true,
     
    },
    desc: [{
      type: String,
      required: false,
    }],
    address: {
      type: String,
      required: false,
    },
    floor: {
      type: String,
      required: false,
    },
    room: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    amount: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: true,
    },
    photo1: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    comments:[{
      text:String,
      required:false,
  }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);