//https://github.com/wordnik/swagger-core/wiki/Datatypes
exports.models = {
    // --------------------------------------------------------------------------------------------
    // General
    // --------------------------------------------------------------------------------------------
    "AppInfo" : {
        "id" : "AppInfo",
        "properties" : {
            "version" : {"type": "string", "description": "Version number of rest api"}
        }
    },
    "Language": {
        "id": "Language",
        "properties" : {
            "id" :              {"type": "integer"},
            "name":             {"type": "string", "description": "English name of the language"},
            "nativeName":       {"type": "string", "description": "Native name of the language"},
            "code":             {"type": "string", "description": "Two letter code of the language, i.e. en, nl"},
        }
    },
    // --------------------------------------------------------------------------------------------
    // People and Permissions
    // --------------------------------------------------------------------------------------------
    "User": {
        "id": "User",
        "properties" : {
            "id" :              {"type": "integer"},
            "firstname" :       {"type": "string", "description": "Firstname of the user"},
            "lastname" :        {"type": "string", "description": "Lastname of the user"},
            "prefix" :          { "type": "string", "description": "Lastname prefix"},
            "username" :        {"type": "string", "description": "username / login name"},
            "emailaddress" :    {"type": "string", "description": "e-mailadres of user"},
            "password" :        {"type": "string", "description": "password hash"},
            //"role" :            {"type": "Role", "description": "refrence to Role"},
            //"permissions" :     {"type": "Array", "items": {"$ref": "Permission"}},
            //"language" :        {"type": "Language", "description": "refrence to Language"},
        }
    },
    "Role" : {
        "id": "Role",
        "properties" : {
            "id" :              {"type": "integer"},
            "name" :            {"type": "string", "description": "Name of the role"},
            "description" :     {"type": "string", "description": "Short description of the role"},
        }
    },
    "Permission" : {
        "id": "Permission",
        "properties" : {
            "name" :            {"type": "string", "description": "Permission tag"},
        }
    },
}