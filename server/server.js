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
      return file;
    }

    try {
      file.content = fs.readFileSync('./demo/' + fileAdr);
    } catch (e) {
      try {
        file.content = fs.readFileSync('./src/' + fileAdr);
      } catch (e) {
        file.content = 'File not found';
      }
    }

    if (file.content) {
      file.status = 200;
      file.mimeType = contentTypes[fileExt] || 'text/plain';
    } else {
      file.mimeType = 'text/plain';
      file.status = 404;
    }

    return file;
  }

  //------------------------------------
  //  Routing
  //------------------------------------

  var server = express();
  server.use(bodyParser.json());

  server.use(/\/.+/, function (req, res, next) {
    console.log('----------------------');
    console.log('Route: ' + req.originalUrl);

    //Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    //Redirect api calls
    if (/^\/api\//.test(req.originalUrl)) {
      next();
      return;
    }

    // Return a file
    var file = getFile(req.originalUrl);
    res.writeHead(file.status, { 'Content-Type': file.mimeType });
    res.end(file.content);
  });

  //Getting files
  server.get('/api/*', function (req, res) {
    console.log('API');
    res.end();
  });

  //POST requests
  server.post('/bookings', function (req, res) {
    var jsonstring = '';
    req.on('data', function (data) {
      jsonstring += data;
    });

    req.on('end', function () {
      console.log('Bookings parameters:');
      console.log(JSON.parse(jsonstring));
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.writeHead(200, {
      'Content-Type': 'application/javascript',
    });
    reandAndRespond('createBooking.json', res);
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
        opener('http:localhost:' + PORT + '/index.html');
      });
    },
  };

}());

server.start();
module.exports = server;
