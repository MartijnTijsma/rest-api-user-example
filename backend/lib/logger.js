var winston       = require('winston');
var config        = require('../config.json');

/**
* Create a logger using logger config parameters.
* @loggerconfig logger options, example:
*    "logger" :
*    {
*        "transports" : [
*            {"name": "Console", "options" : {"colorize": true, "timestamp": true} },
*            {"name": "File",    "options" : {"filename": "mylogfile.log"}}
*        ]
*    }
*/
exports.createLogger = function(loggerconfig){
    var logger = new (winston.Logger)();

    if(loggerconfig == undefined){
        loggerconfig = config.logger; // use defaults
    }

    if(loggerconfig.transports != undefined){
        for(t=0; t<loggerconfig.transports.length; t++){
            if(loggerconfig.transports[t].name != undefined &&
                loggerconfig.transports[t].options != undefined){

                logger.add(winston.transports[loggerconfig.transports[t].name], loggerconfig.transports[t].options);
            }
        }
    }
    return logger;
}