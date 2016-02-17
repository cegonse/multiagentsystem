//
//  main.js
//  - Entrypoint of the agent system runtime.
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

var Simulator = require('./simulator.js');
var fs = require('fs');
var zmq = require('./node_modules/zmq');
var process = require('process');

// Constants
var fePort = 2999;
var localAddr = '127.0.0.1';
var baseSlavePort = 3000;
var debug = true;

// Simulator object
var sim = null;
var lastIm = null;

// Check if this is a slave node or the master node
var master = false;
var index = 0;
var cardinality = 1;

if (process.argv[2] != undefined)
{
    if (process.argv[2] == 0)
    {
        master = true;
        index = 0;
    }
    else
    {
        master = false;
        index = parseInt(process.argv[2]);
    }
}

if (process.argv[3] != undefined)
{
    cardinality = process.argv[3];
}

// Create the sockets
var fdFrontEnd = null;
var fdSlave = null;
var fdMaster = null;

if (master)
{
    // Create the socket to communicate with the frontend
    fdFrontEnd = zmq.socket('rep');
    fdFrontEnd.bind('tcp://' + localAddr + ':' + fePort, function(err)
    {
        if (err)
        {
            console.log('[ERROR] Failed to bind socket to ' + localAddr+':'+fePort);
            process.exit(1);
        }
        else
        {
            if (debug)
            {
                console.log('[DEBUG] Master node link started at ' + localAddr+':'+fePort);
            }
            
            fdFrontEnd.on('message', msgHandlerFrontEnd);
        }
    });
    
    // Create the sockets which the slaves will connect to
    fdSlave = new Array();
    
    for (var i = 1; i < cardinality; i++)
    {
        var fdt = zmq.socket('pair');
        var fp = baseSlavePort + i;
        
        fdt.bind('tcp://' + localAddr + ':' + fp, function(err)
        {
            if (err)
            {
                console.log('[ERROR] Failed to bind socket to ' + localAddr+':'+fp);
                process.exit(1);
            }
            else
            {
                console.log('[DEBUG] Binding slave link on ' + localAddr+':'+fp);
            }
        });
        
        fdt.on('message',onSlaveMsg);
        fdSlave.push(fdt);
    }
}
else
{
    // Create the socket to connect with the master
    fdMaster = zmq.socket('pair');
    var fp = baseSlavePort + index;
    fdMaster.connect('tcp://'+localAddr+':'+fp);
    
    console.log('[DEBUG] Connected to master at '+localAddr+':'+fp);
    
    fdMaster.on('message', onMasterMsg);
}

function onMasterMsg(jmsg)
{
    var msg = JSON.parse(jmsg);
    
    if (msg.command == 'start')
    {
        var p = msg.data;
        
        sim = new Simulator(p);
        sim.initialize();
        lastIm = setImmediate(step, sim);
    }
}

function onSlaveMsg(jmsg)
{
    
}

function msgHandlerFrontEnd(jmsg)
{
    if (debug)
    {
        //console.log('[DEBUG] Frontend message ('+jmsg.length+' bytes).');
    }
    
    var msg = JSON.parse(jmsg);
    
    var resp = 
    {
        command: 'ack',
        data: ''
    }
    
    if (msg.command == 'start')
    {
        if (sim == null)
        {
            // Load the simulation data
            var p = msg.data;

            // Create the node simulator
            sim = new Simulator(p);
            sim.initialize();
            
            // Tell the slave nodes to start
            for (var i = 0; i < fdSlave.length; i++)
            {
                var smsg = 
                {
                    command: 'start',
                    data: p
                }
                
                fdSlave[i].send(JSON.stringify(smsg));
            }
            
            // Launch the simulation
            lastIm = setImmediate(step, sim);
            resp.data = 'ok';
        }
        else
        {
            resp.command = 'error';
            resp.data = 'err_alredy_started';
        }
    }
    else if (msg.command == 'status')
    {
        if (sim != null)
        {
            // Get the simulation progress from the simulator
            resp.data = sim.getProgress();
        }
        else
        {
            resp.command = 'error';
            resp.data = 'err_no_simulation';
        }
    }
    else if (msg.command == 'step')
    {
        if (sim != null)
        {
            // Get the step to serialize
            var ind = parseInt(msg.data);
            resp.data = sim.getStep(ind);
        }
        else
        {
            resp.command = 'error';
            resp.data = 'err_no_simulation';
        }
    }
    else
    {
        resp.command = 'error';
        resp.data = 'err_invalid_command';
    }
    
    // Send the response
    fdFrontEnd.send(JSON.stringify(resp));
}

function step(sim)
{
    if (!sim.finished())
    {
        sim.step();
        lastIm = setImmediate(step, sim);
    }
    else
    {
        clearImmediate(lastIm);
    }
}