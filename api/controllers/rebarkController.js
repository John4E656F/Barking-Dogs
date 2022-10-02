const Rebark = require("../models/Rebark");
const Bark = require("../models/Bark");

//Get ALL Rebarks
exports.getAllRebarks = async (req, res) => {
    try {
        const rebarks = await Rebark.find();
        res.status(200).json({
            status: "success",
            data: {
                rebarks
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Bark
exports.getRebark = async (req, res) => {
    try {
        const rebark = await Rebark.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                rebark
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).sjon({
            status: "fail",
            msg: err.message
        });
    }
};

//Create Bark
exports.createRebark = async (req, res) => {
    try {
        const userId = req.user.id,
            barkId = req.params.id;

        if (await Rebark.exist({ userId, barkId }))
            return res.status(400).json({
                status: "fail",
                msg: "You have already retweeted this tweet"
            })

        let rebark = await Rebark.create({
            userId,
            barkId
        });

        //Increment rebarksCount of the barj by 1
        const bark = await Bark.findByIdAndUpdate(
            barkId,
            {
                $inc: { rebarksCount: 1 }
            },
            { new: true }
        );

        rebark = await rebark
            .populate({
                path: "barkId",
                populate: {
                    path: "userId",
                    select: "name username"
                }
            })
            .populate("userId", "name username")
            .excePopulate();
        res.status(201).json({
            status: "success",
            data: {
                rebark,
                bark
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Barks Of User
exports.getRebarksOfUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const rebarks = await Rebark.find({ userId })
            .populate({
                path: "barkId",
                populate: {
                    path: "userId",
                    select: "name username"
                }
            })
            .populate("userId", "name username")
            .sort("-createdAt");
        res.status(200).json({
            status: "success",
            data: {
                rebarks
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Users who have rebarked the bark
exports.getRebarkedUserOfBark = async (req, res) => {
    try {
        const rebarkedUsers = await Rebark.find({ barkId: req.params.id })
            .populate("userId", "name username")
            .select("userId");

        res.status(200).json({
            status: "success",
            data: {
                rebarkedUsers
            }
        });
    }    catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

exports.deleteRebark = async (req, res) => {
    try {
        const barkId = req.params.id,
            userId = req.user.id;
        const rebark = await Rebark.findOneAndDelete({
            barkId,
            userId
        });
        if (!rebark)
        return res.status(400).json({
            status: "success",
            msg: "You have already removed your rebark for this bark"
        });

        //Decrement rebarksCount of the bark by1  
        const bark = await Bark.findByIdAndUpdate(
            barkId,
            {
                $inc: { rebarksCount: -1 }
            },
            { new : true}
        );
        res
            .status(204)
            .json({ status: "success", msg : "Rebark successfully deleteed" });
    }   catch(err) {
        console.log(err.message);
        res.status(400).sjon({ status: "error", msg: err.message})
    }
};