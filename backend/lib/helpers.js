var config       = require('../config.json')
  , util         = require('util')
  , os           = require('os')
  , logger       = require('../lib/logger').createLogger(config.logger)
  , _            = require('underscore')
  , language_codes= require('./language_codes').language_codes;
  ;


//-----------------------------------------------------------------------------
function getErrorObject(code, description){
    var errObj = new Error(description);
    errObj.code        = code;
    errObj.reason      = description; // bugfix workaround in swagger.js
    errObj.description = description;
    return errObj;
}

//-----------------------------------------------------------------------------
exports.httpErrors = {
    'badRequest': function(field, res) {
        var errorObject = getErrorObject(400, 'Invalid request: ' + field);
        if (!res) return errorObject;
        else      res.send(errorObject, 400);
    },
    'unauthorized': function(field, res) {
        var errorObject = getErrorObject(401, 'Unauthorized, please login before performing this operation');
        if (!res) return errorObject;
        else      res.send(errorObject, 401);
    },
    'wrongCredentials': function(field, res) {
        var errorObject = getErrorObject(403, 'Wrong credentials, please login with the correct credentials');
        if (!res) return errorObject;
        else      res.send(errorObject, 403);
    },
    'forbidden': function(field, res) {
        var errorObject = getErrorObject(403, 'Forbidden, login with another password to get permissions for this request');
        if (!res) return errorObject;
        else      res.send(errorObject, 403);
    },
    'notFound': function(field, res) {
        var errorObject = getErrorObject(404, 'Requested resource ' + field + ' could not be found');
        if (!res) return errorObject;
        else      res.send(errorObject, 404);
    },
    'notAllowed': function(field, res) {
        var errorObject = getErrorObject(405, 'Resource ' + field + ' does not support this operation');
        if (!res) return errorObject;
        else      res.send(errorObject, 405);
    },
    'conflict': function(field, res) {
        var errorObject = getErrorObject(409, 'Conflict, unable to perform this operation on the resource because it violates ' + field + ' state');
        if (!res) return errorObject;
        else      res.send(errorObject, 409);
    }
};

//-----------------------------------------------------------------------------
//YYYY-MM-DD
exports.datePattern = '^2[0-9]{3}-(0[1-9]{1}|1[0-2]{1})-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3{1}[0-1]{1})$';
//-----------------------------------------------------------------------------
exports.writeResponse = function(res, data) {
    res.json(data);
}

//-----------------------------------------------------------------------------
exports.writeErrorResponse = function(res, err) {
    if (err.code && err.description) {
        res.send(JSON.stringify(err), err.code);
    } else {
        res.send(JSON.stringify({"description":"unknown error","code":500}), 500);
    }
}
//-----------------------------------------------------------------------------
/**
 * Get the ip address of the server
 * @return ipAddress
**/
exports.getIpAddress = function(){
    //determine ip address
    var intfName = config.interface;
    var netw = os.networkInterfaces();
    var intf = _.findWhere(netw[intfName], {family: 'IPv4'});
    var ipAddress = intf.address;

    return ipAddress;
}

// ----------------------------------------------------------------------------
/**
 * Check if the user is logged in (the session needs to be valid)
 * @param req - request object
**/
exports.isLoggedIn = function(req, callback){
    if(req.session && req.session.user && req.session.authenticated && req.session.authenticated === true){
        //TODO: update database
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// ----------------------------------------------------------------------------
/**
 * Choose a language which is known in the db
 * @param req - request object
**/
exports.selectLanguage = function(req)
{
    var language = 'en'; // if language is invalid, use the default english
    if(req === undefined) return language;
    var requestedLanguage = undefined;
    if(req.query !== undefined) {
        requestedLanguage = req.query.language; // optional request parameter
    }
    var acceptedLanguages = req.acceptedLanguages; // fallback, browser language
    
    if( requestedLanguage !== undefined && 
        language_codes.indexOf(requestedLanguage) !== -1) {
        language=requestedLanguage; // use the query parameter
    }
    else {
        for(var p=0;p<acceptedLanguages.length;p++){// no query parameter, use first prefered
            var tmp = language=acceptedLanguages[p];
            if(tmp.length >= 2) { // use the browsers prefered
                var index = language_codes.indexOf(tmp.substring(0,2));
                if(index !== -1) { // 
                    language = language_codes[index];
                    break; // found a language we have
                }
            }
            
        }
    }
    return language;
}
