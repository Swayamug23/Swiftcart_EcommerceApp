import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type:String , default:"user"},
  root: {type:Boolean , default:false},
  avatar: { type: String, default: "https://avatar.iran.liara.run/public/42" }
},
{timestamps: true}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
