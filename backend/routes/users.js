// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
var User = require('../models/user.js');
var Exercise = require('../models/exercise.js');
const { ObjectId } = require('bson')

module.exports = function (router) {
    
    var usersRoute = router.route('/users');
    
    const formatQuery = (query) => {
        return eval("("+ query +")");
    };

    usersRoute.get(async function(req, res) {
        try{
            let inputWhere  = formatQuery(req.query.where);
            let inputSort   = formatQuery(req.query.sort);
            let inputSelect = formatQuery(req.query.select);
            let inputSkip   = formatQuery(req.query.skip);
            let inputLimit  = formatQuery(req.query.limit);
            let inputCount  = formatQuery(req.query.count);
         
            data = await User.find(inputWhere)
            .sort(inputSort)
            .select(inputSelect)
            .skip(inputSkip)
            .limit(inputLimit)
            .exec();
            
            if(inputCount) {
                return res.status(200).json({
                    message: 'Users Count Retrieved',
                    data: data.length
                });
            } else {
                return res.status(200).json({
                    message: 'Users Retrieved',
                    data: data
                });
            }
        }
        catch(error){
            return res.status(500).json({
                message: 'Database Error',
                data: req.query
            });
        }
    });



    usersRoute.post(async function (req, res) {
        
        // Checking request body
        if(!req.body){
            return res.status(400).json({
                message: 'Request Body Not Found',
                data: []
            });
        }

        if(!('name' in req.body && typeof(req.body.name) === "string" && req.body.name !== "")) {
            return res.status(400).send({
                message: 'Invalid Name Format',
                data: req.body
            });
        }

        
        if(!('email' in req.body && typeof(req.body.email) === "string" && req.body.email !== "")) { 
            return res.status(400).send({
                message: 'Invalid Email Format',
                data: req.body
            });
        }

        if(!('uid' in req.body && typeof(req.body.uid) === "string" && req.body.uid !== "")) { 
            return res.status(400).send({
                message: 'Invalid uid Format',
                data: req.body
            });
        }

        // Checking validity of task id's in pendingTask
        if('exercises' in req.body && req.body.exercises !== []) { 
            return res.status(400).json({
                message: 'Only accept new users with no exercises',
                data: req.body
            });
        }

        // Checking validity of task id's in pendingTask
        if('logs' in req.body && req.body.logs !== []) { 
            return res.status(400).json({
                message: 'Only accept new users with no logs',
                data: req.body
            });
        }
        
        try{
            let newUser = new User();
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.uid = req.body.uid;
            newUser.logs = [];
            newUser.exercises = [];
            if (req.body.dateCreated)
                newUser.dateCreated = req.body.dateCreated;
            else    
                newUser.dateCreated = Date.now();
            
            User.create(newUser)
            .then((info) => {
                    res.status(201).json({
                    message: 'User created', 
                    data: info,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: 'Server Error',
                    data: error,
                    temp: newUser
                });
            })
        }
        catch(error) {
            return res.status(500).json({
                message: 'Server Error',
                data: error,
                temp: newUser
            });
        }
    })

    return router;
}
