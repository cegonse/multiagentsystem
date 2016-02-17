//
//  environment.js
//  - A class to handle simulation environment serialization.
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

var fs = require('fs');

function Environment()
{
    this.steps = new Array();
}

function saveStepDisk(data, path)
{
    var jsonData = JSON.stringify(data);
    fs.writeFileSync(path, jsonData);
}

function saveStepNetwork(data, path)
{
    // To-Do: serialize step through a ZMQ connection
    //
}

function finalizeDisk(data, path)
{
    fs.writeFileSync(path, JSON.stringify(data));
}

function finalizeNetwork(path)
{
    // To-do: serialize finalization data through a ZMQ connection
    //
}

Environment.prototype.serializeStep = function(ind, target, path, cb)
{
    if (target == 'disk')
    {
        saveStepDisk(this.steps[ind], path + 'step_' + ind + '.json');
        
        if (cb != null)
        {
            cb(null);
        }
    }
    else if (target == 'network')
    {
        saveStepNetwork(this.steps[ind], path);
        
        if (cb != null)
        {
            cb(null);
        }
    }
    else
    {
        console.log('[WARNING] Wrong serialization token (step_'+ind+')');
    }
}

Environment.prototype.getStep = function(ind)
{
    return this.steps[ind];
}

Environment.prototype.serializeAll = function(target, path, cb)
{
    for (var i = 0; i < this.steps.length; i++)
    {
        if (target == 'disk')
        {
            saveStepDisk(this.steps[i], path + 'step_' + i + '.json');
            
            if (cb != null)
            {
                cb(null);
            }
        }
        else if (target == 'network')
        {
            saveStepNetwork(this.steps[i], path);
            
            if (cb != null)
            {
                cb(null);
            }
        }
        else
        {
            console.log("[WARNING] Wrong serialization token (all).");
        }
    } 
}

Environment.prototype.finalize = function(steps, p0, pf)
{
    this.stepCount = steps;
    this.p0 = p0;
    this.pf = pf;
}

Environment.prototype.serializeFinal = function(target, path, cb)
{
    var data = {
        steps: this.stepCount,
        p0: this.p0,
        pf: this.pf
    }
    
    if (target == 'disk')
    {
        finalizeDisk(data, path + 'sim.json');
        
        if (cb != null)
        {
            cb(null);
        }
    }
    else if (target == 'network')
    {
        finalizeNetwork(data, path);
        
        if (cb != null)
        {
            cb(null);
        }
    }
    else
    {
        console.log("[WARNING] Wrong serialization token (sim.json).");
    }
}

Environment.prototype.step = function(step)
{
    // Clone the step before storing
    var cs = JSON.parse(JSON.stringify(step));
    this.steps.push(cs);
}

Environment.prototype.getStepCount = function()
{
    return this.steps.length;
}

module.exports = Environment;

