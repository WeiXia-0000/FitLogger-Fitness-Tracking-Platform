var User = require('../models/user.js');
var Log = require('../models/exercise.js');
var Log = require('../models/log.js');
const { ObjectId } = require('bson')

module.exports = function (router) {

    var logsRoute = router.route('/logs');

    const formatQuery = (query) => {
        return eval("("+ query +")");
    };

    logsRoute.get(async function(req, res) {
        let inputWhere  = formatQuery(req.query.where);
        let inputSort   = formatQuery(req.query.sort);
        let inputSelect = formatQuery(req.query.select);
        let inputSkip   = formatQuery(req.query.skip);
        let inputLimit  = formatQuery(req.query.limit);
        let inputCount  = formatQuery(req.query.count);

        let getLog = await Log.find(inputWhere)
        .sort(inputSort)
        .select(inputSelect)
        .skip(inputSkip)
        .limit(inputLimit)
        .exec();

        if(getLog) {
            if(inputCount) {
                return res.status(200).json({
                    message: 'Logs count retrieved',
                    data: getLog.length
                });
            } else {
                return res.status(200).json({
                    message: 'Logs retrieved',
                    data: getLog
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

    
    
    logsRoute.post(async function (req, res) {
        
        // Checking if request body contains necessary info
        if(!req.body){
            return res.status(400).json({
                message: 'Request body not found',
                data: []
            });
        }
        
        if(!('userId' in req.body && typeof(req.body.userId) === "string" && req.body.userId !== "")) { 
            return res.status(400).json({
                message: 'Missing or invalid userId format',
                data: req.body.deadline
            }); 
        }

        if(!('exerciseId' in req.body && typeof(req.body.exerciseId) === "string" && req.body.exerciseId !== "")) { 
            return res.status(400).json({
                message: 'Missing or invalid exerciseId format',
                data: req.body.deadline
            }); 
        }

    
        newLog = new Log();
        newLog.exerciseId = req.body.exerciseId;
        newLog.userId = req.body.userId;
        if(req.body.dateCreated)
            newLog.dateCreated = req.body.dateCreated;
        if(req.body.set)
            newLog.set = req.body.set;
        if(req.body.reps)
            newLog.reps = req.body.reps;
        if(req.body.weight)
            newLog.weight = req.body.weight;
        if(req.body.notes)
            newLog.notes = req.body.notes;
        if(req.body.restTime)
            newLog.restTime = req.body.restTime;


        // A exercise is assigned to a user, need to update user
        try {
            let getUser = await User.findById(req.body.userId).exec();
            // Checking if assigned user exists
            if(getUser === null){
                return res.status(400).json({
                    message: 'Assigned user not found', 
                    data: req.body.userId,
                });
            }
            
            Log.create(newLog)
                .then((logDetail)=>{
                    User.findByIdAndUpdate(getUser._id, {$push: {logs: logDetail._id}})
                    .then((newLog)=>
                        res.status(201).json({
                            message: 'Log created and user exercises list updated', 
                            data: newLog,
                        })
                    )    
                })
            
        } catch(err) {
            res.status(500).json({
                message : "server error",
                data : err,
            })
        }
    });

    return router;
}