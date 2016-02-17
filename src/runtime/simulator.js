//
//  simulator.js
//  - Simulation object, keeps track of the agents which fall under its
//    influence.
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

//
// Simulator constructor
//
// Params structure:
// - mode: string (vec or rast) containing the mode.
// - env: JSON object containing the intial environment.
// - p0: JSON Vec3 containing the intial spatial bound.
// - pf: JSON Vec3 containing the final spatial bound.
// - saveSteps: boolean, if true all steps are saved, if
//   false only the final step is saved.
// - numSteps: number of steps to simulate.
// - debug: show debug information.
//

var vec3 = require('./vec3.js');
var Environment = require('./environment.js');
var fs = require('fs');

function Simulator(params)
{
    // Run in raster or vector mode?
    if (params.mode == 'vec')
    {
        this.mode = 'vec';
    }
    else if (params.mode == 'rast')
    {
        this.mode = 'rast';
    }
    else
    {
        // Default to vector mode
        this.mode = 'vec';
    }
    
    // Set the initial environment
    this.env = params.env;
    this.envSerializer = new Environment();
    
    // Set the spatial bounds for the simulation
    this.p0 = params.p0;
    this.pf = params.pf;
    
    // Save intermediate steps?
    this.saveSteps = params.saveSteps;
    
    // Number of steps to simulate
    this.numSteps = params.numSteps;
    this.currStep = 0;
    
    // Array to store the agent instances
    this.agents = new Array();
    
    // Show debug information?
    this.debug = params.debug;
}

Simulator.prototype.initialize = function()
{
    if (this.env)
    {
        if (this.debug)
        {
            console.log('Initializing simulation...');
        }
        
        for (var i = 0; i < this.env.agents.length; i++)
        {
            // Load class code
            var Cl = require('./agents/' + this.env.agents[i].type + '.js');
            var t = vec3.bvec3(true);
            
            var b1 = vec3.vec3Gteq(this.env.agents[i].p0, this.p0);
            var b2 = vec3.vec3Lt(this.env.agents[i].p0, this.pf);
            
            // Check if the agent is inside the node bounds
            if (vec3.bvec3Reduce(b1,t) && vec3.bvec3Reduce(b2,t))
            {
                var ag = new Cl(this.env.agents[i]);
                this.agents.push(ag);
                
                if (this.debug)
                {
                    console.log('Created agent:');
                    console.log('> Type: ' + this.env.agents[i].type);
                    console.log('> Position: ' + JSON.stringify(this.env.agents[i].p0));
                }
            }
        }
    }
};

Simulator.prototype.step = function()
{
     // Make all agents see and get their state
    for (var i = 0; i < this.agents.length; i++)
    {
        // Check if the agent is inside the node bounds
        var t = vec3.bvec3(true);
        var b1 = vec3.vec3Gteq(this.agents[i].getPosition(), this.p0);
        var b2 = vec3.vec3Lt(this.agents[i].getPosition(), this.pf);
        
        if (vec3.bvec3Reduce(b1,t) && vec3.bvec3Reduce(b2,t))
        {
            this.agents[i].onSee(this.env);
            this.agents[i].onNext();
        }
    }
    
    // Update the current state using the agent's
    // actions
    for (var i = 0; i < this.agents.length; i++)
    {
        // Check if the agent is inside the node bounds
        var t = vec3.bvec3(true);
        var b1 = vec3.vec3Gteq(this.agents[i].getPosition(), this.p0);
        var b2 = vec3.vec3Lt(this.agents[i].getPosition(), this.pf);
        
        if (vec3.bvec3Reduce(b1,t) && vec3.bvec3Reduce(b2,t))
        {
            this.agents[i].onAction(this.env);
        }
    }

    // Save all steps?
    if (this.saveSteps)
    {
        this.envSerializer.step(this.env);
    }
    
    this.currStep++;
};

Simulator.prototype.finalize = function(target, path)
{
    if (!this.saveSteps)
    {
        this.envSerializer.step(this.env);
    }
    
    this.envSerializer.finalize(this.numSteps, this.p0, this.pf);
    this.envSerializer.serializeFinal(target, path);
}

Simulator.prototype.getStep = function(ind)
{
    return this.envSerializer.getStep(ind);
}

Simulator.prototype.serializeResult = function(target, path)
{
    this.envSerializer.serializeAll(target, path);
}

Simulator.prototype.getStepCount = function()
{
    return this.currStep;
}

Simulator.prototype.getProgress = function()
{
    return (this.currStep / this.numSteps) * 100.0; 
}

Simulator.prototype.finished = function()
{
    return this.currStep >= this.numSteps;
}

module.exports = Simulator;
