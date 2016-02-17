//
//  handler.js
//  - Handler for the HTTP frontend.
//
//  César González Segura, 2016
//  <cegonse@posgrado.upv.es>, <cegonse@alumni.uv.es>
//
//  This application is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  It is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with these files.  If not, see <http://www.gnu.org/licenses/>.
//

var zmq = require('../runtime/node_modules/zmq');
var fs = require('fs');
var url = require('url');

// Load all the viewer files
var index = fs.readFileSync('./viewer/index.html').toString();
var main = fs.readFileSync('./viewer/js/main.js').toString();
var style = fs.readFileSync('./viewer/css/style.css').toString();
var jquery = fs.readFileSync('./viewer/js/jquery.min.js').toString();
var orbit = fs.readFileSync('./viewer/js/OrbitControls.js').toString();
var three = fs.readFileSync('./viewer/js/three.min.js').toString();

// Read the simulation specification from a local file
// @To-Do: read this from the HTTP POST data
var sim = fs.readFileSync('./viewer/res/exampleSimulation.json');

var masterHost = '127.0.0.1';
var masterPort = 2999;

var fd = zmq.socket('req');
fd.connect('tcp://'+masterHost+':'+masterPort);
fd.on('message', messageHandler);
console.log('[DEBUG] Connected to master node.');

var lastResponse = null;

function messageHandler(jmsg)
{
    if (lastResponse != null)
    {
        lastResponse.end(jmsg.toString());
    }
}

module.exports = function(request, response)
{
    var msg = 
    {
        command: '',
        data: ''
    };
    
    // Start simulation
    if (request.url.indexOf('/start') != -1)
    {
        msg = 
        {
            command: 'start',
            data: JSON.parse(sim)
        };
        
        fd.send(JSON.stringify(msg));
        lastResponse = response;
    }
    // Simulation status (progress)
    else if (request.url.indexOf('/status') != -1)
    {
        msg = 
        {
            command: 'status',
            data: ''
        };
        
        fd.send(JSON.stringify(msg));
        lastResponse = response;
    }
    // Get a simulation step
    else if (request.url.indexOf('/step') != -1)
    {
        var curl = url.parse(request.url,true);
        
        msg = 
        {
            command: 'step',
            data: curl.query.ind
        };
        
        fd.send(JSON.stringify(msg));
        lastResponse = response;
    }
    // Requests for the webapp files
    else if (request.url == '/')
    {
        response.end(index);
    }
    else if (request.url == '/js/main.js')
    {
        response.end(main);
    }
    else if (request.url == '/css/style.css')
    {
        response.end(style);
    }
    else if (request.url == '/js/jquery.min.js')
    {
        response.end(jquery);
    }
    else if (request.url == '/js/OrbitControls.js')
    {
        response.end(orbit);
    }
    else if (request.url == '/js/three.min.js')
    {
        response.end(three);
    }
    else
    {
        response.writeHead(404);
        response.end('');
    }
}