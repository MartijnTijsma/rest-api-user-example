//CRUD for users
var db              = require('../lib/db')
  , helper          = require('../lib/helpers')
  , config          = require('../config.json')
  , logger          = require('../lib/logger').createLogger(config.logger)
  , _               = require('underscore')
  ;

exports.getAll = function(callback){
    var sql = 'SELECT * FROM users;';
    db.executeQuery(sql, callback);
}

function getById(id, callback){
    var sql = 'SELECT * FROM users WHERE id = '+db.pool.escape(id)+';';
    db.executeQuery(sql, callback);
}
module.exports.getById = getById;

exports.deleteById = function(id, callback){
    var sql = 'DELETE FROM users WHERE id = '+db.pool.escape(id)+';';
    db.executeQuery(sql, callback);
}

exports.updateById = function(id, user, callback){
    var sql = 'UPDATE users SET ? WHERE id = ?;';
    db.pool.getConnection(function(err, connection){
        if(err) {
            callback(err, null); // handle connection error
        } else {
            connection.query(sql, [user, id], function(err,result){
                connection.release(); // release the connection back to the pool
                getById(id, callback);
            });
        }
    })
}

exports.create = function(user, callback){
    var sql = 'INSERT INTO users SET ?;';
    db.pool.getConnection(function(err, connection){
        if(err) {
            callback(err, null); // handle connection error
        } else {
            connection.query(sql, user, function(err,result){
                connection.release(); // release the connection back to the pool
                getById(result.insertId, callback);
            });
        }
    })
}
