import mongoose from "mongoose"

const schema = mongoose.Schema({
   user: String,
   likes: String,
   date: String,
   content: String
},
{
   timestamp: true,
   collection: "post"
});

export default mongoose.model("post", schema);