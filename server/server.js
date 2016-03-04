var fs = require('fs');
var express = require('express');
var opener = require('opener');
var bodyParser = require('body-parser');
var PORT = 4000;

var server = (function () {
  'use strict';

  //------------------------------------
  //File handling
  //------------------------------------
  var contentTypes = {
      js: 'application/javascript',
      css: 'text/css',
      jpg: 'image/jpeg',
      bmp: 'image/bmp',
      ico: 'image/x-icon',
      html: '	text/html',
      json: 'application/json',
    };

  function getFile(url) {

    var match = url.match(/^\/(.+\.(\w+))$/) || [];
    var fileAdr = match[1];
    var fileExt = match[2];
    var content;
    var mimeType;
    var status;
    var file = {};

    if (!fileAdr) {
      file.content = 'Bad request. No file extention.';
      file.status = 400;
      file.mimeType = 'text/plain';
      return file;
    }

    try {
      file.content = fs.readFileSync('./' + fileAdr);
      file.status = 200;
      file.mimeType = contentTypes[fileExt] || 'text/plain';
    } catch (e) {
      file.content = 'File not found';
      file.status = 404;
      file.mimeType = 'text/plain';
    }

    return file;
  }

  //------------------------------------
  //  Routing
  //------------------------------------

  var server = express();
  server.use(bodyParser.json());

  //---------------
  // General calls

  server.use(/\/.+/, function (req, res, next) {
    console.log('----------------------');
    console.log('Route: ' + req.originalUrl);

    //Redirect api calls
    if (/^\/api\//.test(req.originalUrl)) {
      console.log('Redirecting to api');
      next();
      return;
    }

    //Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Return a file
    var file = getFile(req.originalUrl);
    res.writeHead(file.status, { 'Content-Type': file.mimeType });
    res.end(file.content);
  });

  //---------------
  // API calls

  //GET
  server.get('/api/*', function (req, res) {
    console.log('API');
    res.end();
  });

  //POST
  server.post('/api/*', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    var jsonstring = '';
    req.on('data', function (data) {
      jsonstring += data;
    });

    req.on('end', function () {
      // var reqContent = JSON.parse(jsonstring);
      res.writeHead(200, { 'Content-Type': contentTypes.json });
      res.end(jsonstring);
      console.log('Just echoed:');
      console.dir(jsonstring);
      console.log(req.body);
    });
  });

  return {
    stop: function () {
      server.close(function () {
        process.exit(0);
      });
    },

    start: function () {
      server.listen(PORT, function () {
        console.log('Server listening on: http://localhost:%s', PORT);
        opener('http:localhost:' + PORT + '/demo/index.html');
      });
    },
  };

}());

server.start();
module.exports = server;
