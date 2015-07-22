/* Import node's http module: */
var http = require("http");
var urlParser = require('url');
var utils = require('./utils');

var port = 3000;
var ip = "127.0.0.1";

var routes = {
  '/classes/messages': require('./request-handler').requestHandler
  // ...
};


var server = http.createServer(function(request, response){
  console.log("Serving request type " + request.method + " for url " + request.url);

  var parts = urlParser.parse(request.url);
  var route = routes[parts.pathname];
  if( route ){
    route(request, response);
  } else {
    utils.sendResponse(response, "Not Found", 404);
  }
});

server.listen(port, ip);