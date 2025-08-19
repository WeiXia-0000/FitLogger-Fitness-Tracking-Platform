var User = require('../models/user.js');
var Exercise = require('../models/exercise.js');
var Log = require('../models/log.js');

const { ObjectId } = require('bson')

module.exports = function (router) {

    var logDetail = router.route('/logs/:id');
    
    const formatQuery = (query) => {
        return eval("("+ query +")");
    };

    logDetail.get(async function(req, res) {
        
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

            getLog = await Log.findById(inputId).select(inputSelect).exec();
            
            if(!getLog) {
                return res.status(404).json({
                    message: 'Log is not found',
                    data: { inputId }
                });
            } else {
                return res.status(200).json({
                    message: 'Log Retrieved',
                    data: getLog
                });
            }
        } catch(error) {
            return res.status(500).json({
                message: 'Server Error',
                data: req.query
            });
        }
    });

    
    logDetail.delete(async function (req, res) {
        let inputId = req.params.id;

        try{
            getLog = await Log.findByIdAndDelete(inputId).exec();

            // Cannot find tast
            if(!getLog) {
                return res.status(404).json({
                    message: 'Log is not found',
                    data: inputId
                });
            } 
            // Log is not assigned, directly delete
            else if (getLog.userId === "") {
                getLog.delete().then(() => {
                    return res.status(200).send({
                        message: 'Log deleted and user exercise list updated',
                        data: []
                    });
                })
            } 
            // Log is assigned, need to update user's logs
            else {
                User.findById(getLog.userId).exec()
                .then((user) => {
                    if(user) {
                        user.logs.remove(getLog.id).then(() => {
                            user.save();
                        })
                    }
                })
                .then(
                    getLog.delete()
                    .then(() => {
                        return res.status(200).json({
                            message: 'Log deleted and user logs updated',
                            data: []
                        });
                    })
                )
            }
        }
        catch(error) {
            return res.status(500).json({
                message: 'Database Error',
                data: req.query
            });
        }
    });
    
    return router;
}