import mongoose from "mongoose"

const schema = mongoose.Schema({
   username: {
      type: String,
      required: [true, "Username is"],
      unique: true
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
   },
   password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false
   },
   passwordChangedAt: Date,
   passwordResetToken: String,
   passwordResetExpires: Date,
   description: String,
   photo: String,
   banner: String,
   followers: Array,
   following: Array
},
{
   timestamp: true,
   collection: "user"
})

export default mongoose.model("user", schema)