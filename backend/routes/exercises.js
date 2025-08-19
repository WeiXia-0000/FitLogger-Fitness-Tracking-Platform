var User = require('../models/user.js');
var Exercise = require('../models/exercise.js');
const { ObjectId } = require('bson')

module.exports = function (router) {

    var exercisesRoute = router.route('/exercises');

    const formatQuery = (query) => {
        return eval("("+ query +")");
    };

    exercisesRoute.get(async function(req, res) {
        let inputWhere  = formatQuery(req.query.where);
        let inputSort   = formatQuery(req.query.sort);
        let inputSelect = formatQuery(req.query.select);
        let inputSkip   = formatQuery(req.query.skip);
        let inputLimit  = formatQuery(req.query.limit);
        let inputCount  = formatQuery(req.query.count);

        let getExercise = await Exercise.find(inputWhere)
        .sort(inputSort)
        .select(inputSelect)
        .skip(inputSkip)
        .limit(inputLimit)
        .exec();

        if(getExercise) {
            if(inputCount) {
                return res.status(200).json({
                    message: 'Exercises count retrieved',
                    data: getExercise.length
                });
            } else {
                return res.status(200).json({
                    message: 'Exercises retrieved',
                    data: getExercise
                });
            }
        }
        else{
            return res.status(500).json({
                message: 'Server error',
                data: req.query
            });
        };
    });

    
    
    exercisesRoute.post(async function (req, res) {
        
        // Checking if request body contains necessary info
        if(!req.body){
            return res.status(400).json({
                message: 'Request body not found',
                data: []
            });
        }

        if(!('name' in req.body && typeof(req.body.name) === "string" && req.body.name !== "")) {
            return res.status(400).send({
                message: 'Missing or invalid name format',
                data: req.body.name
            });
        }

    
        newExercise = new Exercise();
        newExercise.name = req.body.name;
        if(req.body.userId)
            newExercise.userId = req.body.userId;
        if(req.body.description)
            newExercise.description = req.body.description;
        if(req.body.picURL)
            newExercise.picURL = req.body.picURL;
        if(req.body.vidURL)
            newExercise.vidURL = req.body.vidURL;
        if(req.body.bodyParts)
            newExercise.bodyParts = req.body.bodyParts;


        // A exercise is assigned to a user, need to update user
        try {
            if (req.body.userId){
                let getUser = await User.findById(req.body.userId).exec();
                // Checking if assigned user exists
                if(getUser === null){
                    return res.status(400).json({
                        message: 'Assigned user not found', 
                        data: req.body.userId,
                    });
                }
                
                Exercise.create(newExercise)
                    .then((exerciseDetail)=>{
                        User.findByIdAndUpdate(getUser._id, {$push: {exercises: exerciseDetail._id}})
                        .then((newExercise)=>
                            res.status(201).json({
                                message: 'Exercise created and user exercises list updated', 
                                data: newExercise,
                            })
                        )    
                    })
            }
            else{
                Exercise.create(newExercise)
                        .then((newExercise)=>
                            res.status(201).json({
                                message: 'Exercise created and user exercises list updated', 
                                data: newExercise,
                            })
                        )    
                }         
        } catch(err) {
            res.status(500).json({
                message : "server error",
                data : err,
            })
        }
    });

    return router;
}