//
//  exampleAgent.js
//  - An agent example.
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

var vec3 = require('../vec3.js');

// Constructor for AgentBase
function AgentBase(self)
{
    // @To-Do: Add constructor code.
    this.state = null;
    this.step = 0;
    this.self = self;

    // Velocity of the agent
    this.velocity = 1;
    this.position = self.p0;
    
    // Pick a random direction to move towards
    this.direction = 
    {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5
    }
}

// Environment must contain the user-defined environment
// object.
AgentBase.prototype.onSee = function(environment)
{
    // Find the nearest agent and set it
    // as the current target.
    var otherAg = new Array();

    for (var i = 0; i < environment.agents.length; i++)
    {
        if (environment.agents[i] != this.self)
        {
            otherAg.push(environment.agents[i]);
        }
    }

    this.target = otherAg[0].p0;

    for (var i = 1; i < otherAg.length; i++)
    {
        if (vec3.vec3Length(otherAg[i].p0) < vec3.vec3Length(this.target))
        {
            this.target = otherAg[i].p0;
        }
    }

    this.step++;
};

AgentBase.prototype.onNext = function()
{
    // Step towards the current target with
    // the preset velocity.
    var mv = vec3.vec3(1,0.5,1);
    mv = vec3.vec3Mul(mv, this.direction);
    this.position = vec3.vec3Add(this.position, mv);
};

AgentBase.prototype.onAction = function(environment)
{
    for (var i = 0; i < environment.agents.length; i++)
    {
        if (environment.agents[i] == this.self)
        {
            environment.agents[i].p0 = this.position;
        }
    }
};

AgentBase.prototype.getPosition = function()
{
    return this.position;
}

module.exports = AgentBase;
