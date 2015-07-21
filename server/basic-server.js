/* Import node modules: */
var cors        = require('cors'),
    bodyParser  = require('body-parser'),
    express     = require('express'),
    fs          = require('fs'),
    http        = require("http"),
    multer      = require("multer"),
    path        = require("path"),
    request     = require("request"),
    url         = require("url");

var handler = require('./request-handler.js');

var app = express();
app.set('trust proxy', 'loopback'); // specify a single subnet

var messages = [];

app.use(cors());
app.use( bodyParser.urlencoded({ extended:true }) );    // to support URL-encoded bodies
app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(multer()); // for parsing multipart/form-data

app.route('/')
  .get(function(req, res) {
    var content = '';
    var fileName = 'index.html'; // could also return req.url for specific url
    var localFile = __dirname + '/public/'; // where public files are located
    // NOTE: __dirname returns the root folder for this js file
    content = localFile + fileName; //setup the file name to be returned

    if (fileName === "index.html") {
      //reads the file referenced by 'content'
      fs.readFile(content, function(err,contents) {
        //if the fileRead was successful...
        if(!err) {
          //send the contents of index.html
          //and then close the request
          res.end(contents);
        } else {
          //otherwise, let us inspect the eror
          //in the console
          console.dir(err);
        }
    });
    } else {
      //if the file was not found, set a 404 header...
      res.writeHead(404, {'Content-Type': 'text/html'});
      //send a custom 'file not found' message and then close the request
      res.end('<h1>Sorry, the page you are looking for cannot be found.</h1>');
    }
  });

app.route('/classes/messages')
  .get(function(req, res) {
    res.status(200).json( {"results": messages} );
  })
  .post(function(req, res) {
    console.dir(req.body);
    messages.push(req.body);
    res.status(201).json( {"results": messages} );
  });

app.route(/^classes\/[\\w\\W]+/)
  .get(function(req, res) {
    res.status(200).json( {"results": messages} );
  })
  .post(function(req, res) {
    console.dir(req.body);
    messages.push(req.body);
    res.status(201).json( {"results": messages} );
  });

// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = "127.0.0.1";

// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
// var server = http.createServer(handler.requestHandler);
var server = http.createServer(app);
server.listen(port, ip);
console.log("Listening on http://" + ip + ":" + port);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

