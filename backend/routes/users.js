//routes for users
var usersModel      = require('../models/users')
  , helper          = require('../lib/helpers')
  , httpErr         = helper.httpErrors
  , config          = require('../config.json')
  , logger          = require('../lib/logger').createLogger(config.logger)
  , routeModels     = require('./swagger_route_models')
  ;

//-----------------------------------------------------------------------------
// Route definition
exports.definition =
{
    resourcePath: '/Users',
    apis :
    [{
        path: '/Users/All/',
        operations: [{
            httpMethod: 'GET',
            nickname: 'getAll',
            summary: 'Show all users' ,
            responseClass: "User",
            type : "User",
            errorResponses : [httpErr.unauthorized('user')]
        }]
    },
    {
        path: '/Users/',
        operations: [{
            httpMethod: 'POST',
            nickname: 'create',
            summary: 'Add a new user' ,
            responseClass: "User",
            type : "User",
            parameters : [{
                paramType: "body",
                dataType: "User",
                required: true
            }],
            errorResponses : [httpErr.unauthorized('user')]
        }]
    },{
        path: '/Users/Id/{id}',
        operations: [{
            httpMethod: 'GET',
            nickname: 'getById',
            summary: 'Get a user by id' ,
            responseClass: "User",
            type : "User",
            parameters: [{
                paramType: "path",
                name: "id",
                dataType: "integer",
                required: true,
                minimum: 1
            }],
            errorResponses : [httpErr.unauthorized('user')]
        },
        {
            httpMethod: 'PUT',
            nickname: 'updateById',
            summary: 'Update a user by id' ,
            responseClass: "User",
            type : "User",
            parameters : [{
                paramType: "path",
                name: "id",
                dataType: "integer",
                required: true,
                minimum: 1
            },{
                paramType: "body",
                dataType: "User",
                required: true
            }],
            errorResponses : [httpErr.unauthorized('user')]
        },{
            httpMethod: 'DELETE',
            nickname: 'deleteById',
            summary: 'Delete a user by id' ,
            responseClass: "User",
            type : "User",
            parameters : [{
                paramType: "path",
                name: "id",
                dataType: "integer",
                required: true,
                minimum: 1
            }],
            errorResponses : [httpErr.unauthorized('user')]
        }],
    }]
    //models : routeModels.models
}


//-----------------------------------------------------------------------------
exports.getAll = function(req, res, next){
    usersModel.getAll(function(err, users){
        if(err){
            helper.writeErrorResponse(res, httpErr.badRequest('user'));
        } else {
            if(users && users.length > 0){
                var result = {};
                result.users = users;
                helper.writeResponse(res, result);
            } else {
                helper.writeErrorResponse(res, httpErr.notFound('user'));
            }
        }
    });
}

//-----------------------------------------------------------------------------
exports.getById = function(req, res, next){
    var id = req.input.id;
    if(id){
        usersModel.getById(id, function(err, users){
            if(err){
                helper.writeErrorResponse(res, httpErr.badRequest('user'));
            } else {
                if(users && users.length > 0){
                    helper.writeResponse(res, users[0]);
                } else {
                    helper.writeErrorResponse(res, httpErr.notFound('user'));
                }
            }
        });
    } else {
        helper.writeErrorResponse(res, httpErr.badRequest('user'));
    }
}

//-----------------------------------------------------------------------------
exports.create = function(req, res, next){
    var body = req.body;
    console.log('body: ', body);
    if(body){
        usersModel.create(body, function(err, users){
            if(err){
                console.log(err);
                helper.writeErrorResponse(res, httpErr.badRequest('user'));
            } else {
                helper.writeResponse(res, users[0]);
            }
        });
    } else {
        helper.writeErrorResponse(res, httpErr.badRequest('user'));
    }
}

//-----------------------------------------------------------------------------
exports.updateById = function(req, res, next){
    var body = req.body;
    var id = req.input.id;
    console.log('body: ', body);
    if(body && id){
        usersModel.updateById(id, body, function(err, users){
            if(err){
                console.log(err);
                helper.writeErrorResponse(res, httpErr.badRequest('user'));
            } else {
                helper.writeResponse(res, users[0]);
            }
        });
    } else {
        helper.writeErrorResponse(res, httpErr.badRequest('user'));
    }
}

//-----------------------------------------------------------------------------
exports.deleteById = function(req, res, next){
    var id = req.input.id;
    if(id){
        usersModel.deleteById(id, function(err, result){
            if(err){
                helper.writeErrorResponse(res, httpErr.badRequest('user'));
            } else if(result){
                var msg = {'message': 'user with id '+id+' removed'}
                helper.writeResponse(res, msg);
            } else {
                helper.writeErrorResponse(res, httpErr.notFound('user'));
            }
        });
    } else {
        helper.writeErrorResponse(res, httpErr.badRequest('user'));
    }
}

