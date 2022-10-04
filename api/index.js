require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.URL;

mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
app.use(cors())
app.use(express.json());


const testRoute = require('./test.routes');
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
// const barkRoute = require("./routes/barkRoute");
// const connectionRoute = require("./routes/connectionRoute");
// const messageRoute = require("./routes/messageRoute");
// const conversationRoute = require("./routes/conversationRoute");

app.use('/', testRoute)
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
// app.use("/api/bark", barkRoute);
// app.use("/api/connect", connectionRoute);
// app.use("/api/message", messageRoute);
// app.use("/api/conversations", conversationRoute);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
