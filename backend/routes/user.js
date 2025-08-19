var User = require('../models/user.js');
var Exercise = require('../models/exercise.js');
var Log = require("../models/log.js");
const { ObjectId } = require('bson')

module.exports = function (router) {

    var userRoute = router.route('/users/:id');

    const formatQuery = (query) => {
        return eval("("+ query +")");
    };

    userRoute.get(async function (req, res) {

        // Check id validity
        if(!('id' in req.params && typeof(req.params.id) === "string" && req.params.id !== "" && ObjectId.isValid(req.params.id))) {
            return res.status(400).json({
                message: 'Invalid ID Format',
                data: req.body
            });
        }

        try{
            let inputSelect = formatQuery(req.query.select);
            let inputId = req.params.id;
            let getUser = await User.findById(inputId).select(inputSelect).exec();
            if (getUser !== null) {
                return res.status(200).json({
                    message: "User found",
                    data: getUser,
                });
            } else {
                return res.status(404).json({
                    message:"User not found",
                    data: inputId,
                });
            }
        } catch(error) {
            res.status(500).json({
                message: "Server error",
                data: error,
            })
        }
    });


    userRoute.put(async function (req, res) {
        if(!req.body){
            return res.status(400).json({
                message: 'Request Body Not Found',
                data: []
            });
        }

        if(!('name' in req.body && typeof(req.body.name) === "string" && req.body.name !== "")) {
            return res.status(400).json({
                message: 'Invalid name format in request body',
                data: req.body
            });
        }

        try {
            // Update user
            let newUser = await User.findByIdAndUpdate(req.params.id, {name: req.body.name}, {returnOriginal: false});
            return res.status(200).json({
                message: "OK",
                data: newUser,
            });

        } catch(err) {
            res.status(500).json({
                message : "server error",
                data : err,
            })
        }

    });

    userRoute.delete(async function (req, res) {
        try {
            if(!('id' in req.params && typeof(req.params.id) === "string" && req.params.id !== "" && ObjectId.isValid(req.params.id))) {
                return res.status(400).json({
                    message: 'Invalid ID Format',
                    data: req.body
                });
            }

            id = req.params.id;
            let user = await User.findById(id).exec();

            if (user === null) {
                res.status(404).json({
                    message: "User not found",
                    data: id,
                })
            } else if (user.exercises === []) {
                user.delete().then(()=>{
                    res.status(200).json({
                        message: "User deleted",
                        data: user,
                    })
                })
            } else {
                await Log.deleteMany({userId: user.id});
                await Exercise.deleteMany({userId: user.id});
                user.delete().then(()=>{
                    res.status(200).json({
                        message: "User and exercises and logs deleted ",
                        data: user,
                    })
                })
            }
        } catch(err) {
            res.status(500).json({
                message: "Server error",
                data: err,
            })
        }
    });

    return router;
}
