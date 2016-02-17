Runtime component
=================

The runtime component is in charge of executing the multi-agent simulation. The component
consists of the following files:

* _main.js_: entry point of the application. Expects the instance index and cardinality
as a command line parameter. It creates the ZMQ connections with the frontend and with
the slave simulator instances, and launches the simulation when commanded through the
frontend. The simulation file is received from the frontend, as a JSON object with the 
following syntax:

> mode: _vec_ for vectorial simulation, _rast_ for raster simulation.

> env: initial state of the environment.

> agents (Array): array containing the agents to be instanced when the
simulation is started. Agent objects are formed by the properties _type_,
a string with the name of the agent class to instance and _p0_, a Vec3 object
containing the intial position of the agent.

> saveSteps: if _true_, all simulation steps are kept in memory. If _false_,
only the final step is kept in memory.

> numSteps: number of steps to iterate.

> cardinality: how many simulator runtime instances does the simulation use.

* _simulator.js_: class containing the simulator object. Instances the agents on the
environments initial state and iterates the simulation the defined number of steps
in the simulation file.

* _vec3.js_: class with definitions and operations to work with 3D vectors. Used for
vectorial simulations.

* _environment.js_: holds the state of the simulation environment and is responsible
of its serialization.

* _agents/interface.js_: interface of all agent classes. When defining a new agent,
its code must be based upon this interface and it must implement all the methods
defined here.

* _agents/exampleAgent.js_: an example agent which sets a random 3D direction to move
towards and advances each step.

## Running

The runtime has no failure protection, if one of the nodes (be it the frontend or other
runtime instance) fails the others will not notice. To properly running the simulator,
the master instance must be run first, and the frontend and slave instances when the
master has finished launching.