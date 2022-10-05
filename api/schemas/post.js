import mongoose from "mongoose"

const schema = mongoose.Schema({
   user: String,
   likes: String,
   content: String
},
{
   timestamp: true,
   collection: "post"
});

export default mongoose.model("post", schema);