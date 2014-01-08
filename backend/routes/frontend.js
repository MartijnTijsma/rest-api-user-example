/*
 * Routes for frontend
 */
 var config     = require('../config.json')
   , helper     = require('../lib/helpers')
   , _          = require('underscore')
   ;

 //-----------------------------------------------------------------------------
 /**
 * Render the main index page
 **/
exports.index = function(req, res){
    res.render('index.html');
};
//-----------------------------------------------------------------------------
 /**
 * Render the partials
 **/
exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('views/' + name);
};

//-----------------------------------------------------------------------------
 /**
 * Render the config.js file
 **/
exports.config = function(req, res){
    var ipAddress = helper.getIpAddress();
    var port = config.webserver.port;

    var text = "function getIp(){";
    text += "return '"+ipAddress+"';";
    text += "}\r\n";
    text += "function getPort(){";
    text += "return '"+port+"';";
    text += "}\r\n";

    res.header("Content-Type", "text/javascript; charset=utf-8");
    res.send(text);
}