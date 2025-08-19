/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/logs', require('./logs.js')(router));
    app.use('/api/users', require('./users.js')(router));
    app.use('/api/exercises', require('./exercises.js')(router));
    app.use('/api/logs/:id', require('./log.js')(router));
    app.use('/api/users/:id', require('./user.js')(router));
    app.use('/api/exercises/:id', require('./exercise.js')(router));
};