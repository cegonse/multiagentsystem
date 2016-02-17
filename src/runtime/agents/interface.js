//
//  interface.js
//  - Interface template for the agent code. All agents must share the same
//    structure of this template.
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


// Constructor for AgentBase
function AgentBase(self)
{
    // @To-Do: Add constructor code.
    this.state = null;
    this.step = 0;
    this.self = self;
    this.position = self.p0;
}

// Environment must contain the user-defined environment
// object.
AgentBase.prototype.onSee = function(environment)
{
    // @To-Do: Add perception code.
    this.step++;
};

AgentBase.prototype.onNext = function()
{
    // @To-Do: Add next state modifier code.
};

AgentBase.prototype.onAction = function(environment)
{
    // @To-Do: Add action environment modifier code.
};

AgentBase.prototype.getPosition = function()
{
    return this.position;
}

module.exports = AgentBase;