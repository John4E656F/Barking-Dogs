require("dotenv").config({ path: "./.env"})
const mongoose = require("mongoose");
const { cloudinaryConfig } = require("./utils/upload");

cloudinaryConfig();
const app = require("./app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});

const DB = process.env.URL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err))

    let users = [];

    const addUser = (userId, socketId) => {
        !users.some(user => user.userId === userId) &&
            users.push({ userId, socketId });
    };

    const removeUser = socketId => {
        users = users.filter(user => user.socketId !== socketId);
    };

    const getUser = userId => {
        return users.find(user => user.userId === userId);
    };

    io.on("connection", socket => {
        //when user connect
        console.log("A user connected.");

        //take userId and socketId from user
        socket.on("addUser", userId => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        });

        //send and get message
        socket.on("sendMessage", ({ senderId, receiverId, text }) => {
            const user = getUser(receiverId);
            io.to(user.socket.id).emit("getMessage", {
                senderId,
                text
            });
        });

        //when user disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected!");
            removeUser(socket.id);
            io.emit("getUsers", users);
        });
    });

    const port = process.env.PORT || 3001;
    server.listen(port, () => {
        console.log(`Listening to port ${port}`);
    });