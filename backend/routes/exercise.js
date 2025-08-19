var User = require('../models/user.js');
var Exercise = require('../models/exercise.js');
const { ObjectId } = require('bson')

module.exports = function (router) {

    var exerciseRoute = router.route('/exercises/:id');
    
    const formatQuery = (query) => {
        return eval("("+ query +")");
    };

    exerciseRoute.get(async function(req, res) {
        
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

            getExercise = await Exercise.findById(inputId).select(inputSelect).exec();
            
            if(!getExercise) {
                return res.status(404).json({
                    message: 'Exercise is not found',
                    data: { inputId }
                });
            } else {
                return res.status(200).json({
                    message: 'Exercise Retrieved',
                    data: getExercise
                });
            }
        } catch(error) {
            return res.status(500).json({
                message: 'Server Error',
                data: req.query
            });
        }
    });

    
    exerciseRoute.delete(async function (req, res) {
        let inputId = req.params.id;

        try{
            
            getExercise = await Exercise.findByIdAndDelete(inputId).exec();

            // Cannot find tast
            if(!getExercise) {
                return res.status(404).json({
                    message: 'Exercise is not found',
                    data: inputId
                });
            } 
            // Exercise is not assigned, directly delete
            else if (getExercise.userId === "") {
                getExercise.delete().then(() => {
                    return res.status(200).send({
                        message: 'Exercise deleted and user exercise list updated',
                        data: []
                    });
                })
            } 
            // Exercise is assigned, need to update user's exercises
            else {
                User.findById(getExercise.userId).exec()
                .then((user) => {
                    if(user) {
                        user.exercises.remove(getExercise.id).then(() => {
                            user.save();
                        })
                    }
                })
                .then(
                    getExercise.delete()
                    .then(() => {
                        return res.status(200).json({
                            message: 'Exercise deleted and user exercises updated',
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