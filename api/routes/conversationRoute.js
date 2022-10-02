const router = require("express").Router();
const { json } = require("express");
const Conversation = require("../models/Conversation");

//Add New Conversation
router.post('/', async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get Conversation of User
router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] }
        });
        res.status(200).json(conversation);
    }   catch(err) {
        res.status(500).json(err);
    }
});

//Get Covnersation Includes Two userId
router.get("/fionnd/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [ req.params.firstUserId, req.params.secondUserId] }
        });
        res.status(200)/json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;