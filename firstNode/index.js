var http = require('http');
require('./lib/connection');
var employeeService = require('./lib/employees');
var responder = require('./lib/responseGenerator');
var colors = require('colors');


console.log('Server running employee Server');

http.createServer(function(req,res){

    var _url;

    req.method = req.method.toUpperCase();

    console.log(req.method + ' ' + req.url);


    if(req.method !== 'GET'){
        res.writeHead(501,{'Content-Type': 'text/plain'});
        return res.end(req.method+ ' is not implemented by this server.');
    }

    if(_url = /^\/employees$/i.exec(req.url)){
        employeeService.getEmployees(function(error,data){

            if(error) return responder.send500(error,res);   // head 500

            return responder.sendJson(data,res); // head 200 + data
        });
    }
    else if(_url = /^\/employees\/(\d+)$/i.exec(req.url)){
        employeeService.getEmployee(_url[1],function(error,data){

            if(error) return responder.send500(error,res);   // head 500
            if(!data) return responder.send404(res); // 404

            return responder.sendJson(data,res);//200
        });
    }
    else{
        //  static file
        var staticPageRead = responder.staticFile('/public');
        staticPageRead(req.url,res);
    }
}).listen(1337,'127.0.0.1');

