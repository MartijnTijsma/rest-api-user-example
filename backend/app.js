var restApiVersion = '0.1.0';

var express     = require('express')
  , argv        = require('optimist').argv
  , http        = require('http')
  , path        = require('path')
  , swagger     = require('swagger-jack')
  , yaml        = require('js-yaml')

// ------------------------------------------------------------------------------------------------
var config      = require('./config.json') //copy from config.json.dist and alter!!!
  , logger      = require('./lib/logger').createLogger(config.logger)
  , helper      = require('./lib/helpers')
  , httpErr     = helper.httpErrors
  , db          = require('./lib/db')
  ;

// ------------------------------------------------------------------------------------------------
//routes

var routeModels = require('./routes/swagger_route_models')
  , users       = require('./routes/users')
  , frontend    = require('./routes/frontend')

var ipAddress = helper.getIpAddress();
// ------------------------------------------------------------------------------------------------
// enable web server logging; pipe those log messages through winston / logger
var logStream = {
    write: function(message){
        logger.debug(message.replace(/\n$/, ''));
    }
};

var app = express();

// all environments
app.set('port', config.webserver.port || 3000);
app.set('views', config.webfrontend.path);
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger({format: 'dev', stream:logStream}));
app.use(express.static(config.webfrontend.path));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'L1v1nd!M0n1t0r',
    key: 'livind_monitor.sid',
    cookie: {
       maxAge: null,
    }
}));
app.use(function(req, res, next) {
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Cache-Control", "no-cache, no-store");
    return next();
});
app.use(swagger.generator(
    app,
    {//general descriptor
        apiVersion: restApiVersion,
        basePath: 'http://'+ipAddress+':'+app.get('port')+'/api',
        swaggerVersion: "1.1",
    },
    [// resources, descriptors and code for all routes
        // --------------------------------------
        // General
        {// rest api information object
            api :
            {
                resourcePath: '/AppInfo',
                description: 'General appliction information',
                apis :
                [{
                    path: '/AppInfo',
                    operations: [{
                        httpMethod: 'GET',
                        nickname: 'getAppInfo',
                        summary: 'Get general application information' ,
                        responseClass: "AppInfo",
                        type : "AppInfo",
                    }]
                }],
                models : routeModels.models
            },
            controller : {getAppInfo : function(req, res, next) {
                helper.writeResponse(res, {'version': restApiVersion});
            }}
        },
        {// Users
            api: users.definition,
            controller: users,
        }
    ],
    {//
        descPath: '/api-docs'
    }
));
// do not change the order of the calls below!
app.use(swagger.validator(app));
app.use(app.router);
app.use(swagger.errorHandler());

//-----------------------------------------------------------------------------
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//-----------------------------------------------------------------------------
// ----------------- Route configuration --------------------------------------
//-----------------------------------------------------------------------------

// Function as a webserver for the frontend
app.get('/', frontend.index);
app.get('/docs/config.js', frontend.config);
app.get('/partials/:name', frontend.partials);


// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/docs/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
        res.writeHead(302, { 'Location' : req.url + '/' });
        res.end();
        return;
    }
    // take off leading /docs so that connect locates file correctly
    req.url = req.url.substr('/docs'.length);
    return docs_handler(req, res, next);
});

//-----------------------------------------------------------------------------
//-------------------- start server -------------------------------------------
//-----------------------------------------------------------------------------
http.createServer(app).listen(app.get('port'), function(){
    logger.info('Express server listening on port ' + app.get('port'));
});

//-----------------------------------------------------------------------------
//------------------- Setup database connection -------------------------------
//-----------------------------------------------------------------------------
