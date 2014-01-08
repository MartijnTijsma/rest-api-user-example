var mysql       = require('mysql')
  , util        = require("util")
  , config      = require('../config.json')
  , logger      = require('./logger').createLogger(config.logger)
  ;

//-------------------------------------------------------------------------------------------------
var _pool = mysql.createPool(config.db);
exports.pool = _pool; // expose pool for esacape function: db.pool.escape(...)
//-------------------------------------------------------------------------------------------------
exports.executeQuery = function(myQuery, callback){
    _pool.getConnection(function(err, connection){
        if(err) {
            callback(err, null); // handle connection error
        }
        else {
            // do something with connection
            connection.query(myQuery, function(err,rows){
                callback(err,rows);
                connection.release(); // release the connection back to the pool
            });
        }
    })
}
//-------------------------------------------------------------------------------------------------
_pool.on('connection', function(connection) {
    // this code will only be executed once on creation off the  connection in the pool
});