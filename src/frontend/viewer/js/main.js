//
//  main.js
//  - Frontend webapp main.
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

function init()
{
    // Renderer relative parameters
    var w = $('#renderer').width();
    var h = $('#renderer').height();
    
    window.ctxScene = new THREE.Scene();
    window.ctxCamera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    
    window.ctxCamera.position.set(10,10,10);
    window.ctxCamera.lookAt(new THREE.Vector3(0,0,0));
    
    window.ctxRenderer = new THREE.WebGLRenderer(
    {
        antialias: true
    });
    
    window.ctxRenderer.setSize(w,h);
    window.ctxRenderer.setClearColor(0xffffff);
    $('#renderer').html(window.ctxRenderer.domElement);
    
    window.ctxControls = new THREE.OrbitControls(window.ctxCamera, $('#renderer')[0]);
    window.ctxControls.enableDamping = true;
    window.ctxControls.dampingFactor = 0.5;
    window.ctxControls.enableZoom = true;
    window.ctxLoop = null;
    
    addGrid();
    
    // Simulation relative parameters
    window.ctxSimulation = 
    {
        currStep: 0,
        path: '',
        p0: null,
        pf: null,
        steps: 2500
    };
    
    render();
}

function render()
{
    requestAnimationFrame(render);
    window.ctxRenderer.render(window.ctxScene, window.ctxCamera);
}

function addGrid()
{
    // Materials for the three axes
    var xmat = new THREE.LineBasicMaterial(
    {
        color: 0xFF0000
    });
    
    var ymat = new THREE.LineBasicMaterial(
    {
        color: 0x00FF00
    });
    
    var zmat = new THREE.LineBasicMaterial(
    {
        color: 0x0000FF
    });
    
    var grmat = new THREE.LineBasicMaterial(
    {
        color: 0xAAAAAA
    });
    
    // Geometry for the three axes
    var gx = new THREE.Geometry();
    gx.vertices.push(
        new THREE.Vector3(-500,0,0),
        new THREE.Vector3(500,0,0)
    );
    
    var gy = new THREE.Geometry();
    gy.vertices.push(
        new THREE.Vector3(0,-500,0),
        new THREE.Vector3(0,500,0)
    );
    
    var gz = new THREE.Geometry();
    gz.vertices.push(
        new THREE.Vector3(0,0,-500),
        new THREE.Vector3(0,0,500)
    );
    
    // Add the axes to the scene
    window.ctxScene.add(new THREE.Line(gx,xmat));
    window.ctxScene.add(new THREE.Line(gy,ymat));
    window.ctxScene.add(new THREE.Line(gz,zmat));
    
    // Add the grid lines to the scene
    for (var i = -500; i < 500; i += 10)
    {
        if (i != 0)
        {
            var gtr = new THREE.Geometry();
            gtr.vertices.push(
                new THREE.Vector3(-500,0,i),
                new THREE.Vector3(500,0,i)
            );
            
            window.ctxScene.add(new THREE.Line(gtr,grmat));
            
            gtr = new THREE.Geometry();
            gtr.vertices.push(
                new THREE.Vector3(i,0,-500),
                new THREE.Vector3(i,0,500)
            );
            
            window.ctxScene.add(new THREE.Line(gtr,grmat));
        }
    }
}

function createLabel(text, pos, color)
{
    var widthHalf = 0.5*$('#renderer').width();
    var heightHalf = 0.5*$('#renderer').height();

    window.ctxCamera.updateProjectionMatrix();
    pos.project(window.ctxCamera);
    var xx = (pos.x * widthHalf) + widthHalf;
    var yy = -(pos.y * heightHalf) + heightHalf;
    
    var t = document.createElement('div');
    t.style.position = 'absolute';
    t.style.width = '100';
    t.style.height = '30';
    t.style.backgroundColor = 'rgb(255,255,255,0)';
    t.style.color = color;
    t.style.fontWeight = 'bold';
    t.innerHTML = text;
    t.style.top = xx + 'px';
    t.style.left = yy + 'px';
    
    $('#renderer')[0].appendChild(t);
    return t;
}

function updateLabel(pos, t)
{
    var widthHalf = 0.5*$('#renderer').width();
    var heightHalf = 0.5*$('#renderer').height();

    window.ctxCamera.updateProjectionMatrix();
    pos.project(window.ctxCamera);
    var xx = (pos.x * widthHalf) + widthHalf;
    var yy = -(pos.y * heightHalf) + heightHalf;
    
    t.style.top = xx + 'px';
    t.style.left = yy + 'px';
}

function togglePlay()
{
    if (window.ctxLoop)
    {
        clearInterval(window.ctxLoop);
        window.ctxLoop = null;
    }
    else
    {
        window.ctxLoop = setInterval(nextStep, 100);
    }
}

function nextStep()
{
    if (window.ctxSimulation.currStep < window.ctxSimulation.steps - 1)
    {
        window.ctxSimulation.currStep++;
    }
    else
    {
        window.ctxSimulation.currStep = 0;
    }
    
    $('#currentStep').html(window.ctxSimulation.currStep);
    
    // Load the corresponding step
    loadStep();
}

function prevStep()
{
    if (window.ctxSimulation.currStep > 0)
    {
        window.ctxSimulation.currStep--;
    }
    else
    {
        window.ctxSimulation.currStep = window.ctxSimulation.steps - 1;
    }
    
    $('#currentStep').html(window.ctxSimulation.currStep);
    
    // Load the corresponding step
    loadStep();
}

function loadSimulation()
{
    $('#totalSteps').html(window.ctxSimulation.steps.toString());
    $('#currentStep').html(window.ctxSimulation.currStep);
    
    // Start the simulation
    $.ajax({
        url: '/start',
        success: function()
        {
            loadStep();
        }
    });
}

function loadStep()
{
    // Load the first step
    $.ajax({
        url: '/step?ind=' + this.ctxSimulation.currStep,
        success: function(result)
        {
            var d = JSON.parse(result);
            drawAgents(d.data);
        }
    });
}

function drawAgents(stepData)
{
    // Remove current agents in the scene
    for (var i = 0; i < stepData.agents.length; i++)
    {
        var obj = window.ctxScene.getObjectByName('Agent_' + i);
        
        if (obj != undefined || obj != null)
        {
            window.ctxScene.remove(obj);
        }
    }
    
    // Loop through all the agents in the step
    for (var i = 0; i < stepData.agents.length; i++)
    {
        var p0 = stepData.agents[i].p0;
        var type = stepData.agents[i].type;
        
        // Check if the current agent is instanced in the scene
        var ag = window.ctxScene.getObjectByName('Agent_' + i);
        
        if (ag == null)
        {
            // Add agent to the scene
            var geometry = new THREE.SphereGeometry(1, 32, 32);
            var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        
            ag = new THREE.Mesh(geometry, material);
            ag.name = 'Agent_' + i;
        
            window.ctxScene.add(ag);
        }
        
        // Set the agent position
        ag.position.set(p0.x, p0.y, p0.z);
    }
}

$(document).ready()
{
    init();
}

$(window).resize(function()
{
    var w = $('#renderer').width();
    var h = $('#renderer').height();
    
    window.ctxCamera.aspect = w/h;
    window.ctxCamera.updateProjectionMatrix();
    window.ctxRenderer.setSize(w,h);
});