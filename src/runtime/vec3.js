//
//  vec3.js
//  - Utility file containing functions to operate with JSON Vec3.
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

// vec3Add
// - Returns a + b.
//
module.exports = 
{
    vec3: function(xx,yy,zz)
    {
        var r = {
            x: xx,
            y: yy,
            z: zz
        };
        
        return r;
    },

    vec3Length: function(v)
    {
        var r = 0;

        r += v.x*v.x;
        r += v.y*v.y;
        r += v.z*v.z;

        r = Math.sqrt(r);
        return r;
    },

    vec3Normalize: function(v)
    {
        if (v.x == 0 && v.y == 0 && v.z == 0)
        {
            return v;
        }
        else
        {
            var r = v;
            var l = 0;
        
            l += r.x*r.x;
            l += r.y*r.y;
            l += r.z*r.z;
            l = Math.sqrt(l);
    

            r.x /= l;
            r.y /= l;
            r.z /= l;

            return r;
        }
    },

    vec3Add: function(a, b)
    {
        var c = a;
        
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        c.z = a.z + b.z;
        
        return c;
    },

    vec3Sub: function(a, b)
    {
        var c = a;

        c.x = a.x - b.x;
        c.y = a.y - b.y;
        c.z = a.z - b.z;

        return c;
    },


    // vec3Mul
    // - Returns the component by component
    //   product of a and b.
    //
    vec3Mul: function(a, b)
    {
        var c = a;
        
        c.x = a.x * b.x;
        c.y = a.y * b.y;
        c.z = a.z * b.z;
        
        return c;
    },

    vec3ScalMul: function(a, b)
    {
        var c = b;
        
        c.x = a * b.x;
        c.y = a * b.y;
        c.z = a * c.z;

        
        return c;
    },

    // vec3Div
    // - Returns the component by component
    //   division of a and b.
    //
    vec3Div: function(a, b)
    {
        var c;
        
        c.x = a.x / b.x;
        c.y = a.y / b.y;
        c.z = a.z / b.z;
        
        return c;
    },

    // vec3Dot
    // - Returns the dot product of a and b.
    //
    vec3Dot: function(a, b)
    {
        var c;
        
        c += a.x * b.x;
        c += a.y * b.y;
        c += a.z * b.z;
        
        return c;
    },

    // vec3Eq
    // - Returns a bvec3 with the component-wise
    //   equality comparison.
    //
    vec3Eq: function(a, b)
    {
        var c =
        {
            x: false,
            y: false,
            z: false
        };
        
        if (a.x == b.x)
            c.x = true;
        
        if (a.y == b.y)
            c.y = true;
        
        if (a.z == b.z)
            c.z = true;
        
        return c;
    },

    // vec3Gt
    // - Returns a bvec3 with the component-wise
    //   greater than comparison.
    //
    vec3Gt: function(a, b)
    {
        var c =
        {
            x: false,
            y: false,
            z: false
        };
        
        if (a.x > b.x)
            c.x = true;
        
        if (a.y > b.y)
            c.y = true;
        
        if (a.z > b.z)
            c.z = true;
        
        return c;
    },

    // vec3Lt
    // - Returns a bvec3 with the component-wise
    //   lesser than comparison.
    //
    vec3Lt: function(a, b)
    {
        var c =
        {
            x: false,
            y: false,
            z: false
        };
        
        if (a.x < b.x)
            c.x = true;
        
        if (a.y < b.y)
            c.y = true;
        
        if (a.z < b.z)
            c.z = true;
        
        return c;
    },

    // vec3Gteq
    // - Returns a bvec3 with the component-wise
    //   greater or equan than comparison.
    //
    vec3Gteq: function(a, b)
    {
        var c =
        {
            x: false,
            y: false,
            z: false
        };
        
        if (a.x >= b.x)
            c.x = true;
        
        if (a.y >= b.y)
            c.y = true;
        
        if (a.z >= b.z)
            c.z = true;
        
        return c;
    },

    // vec3Lteq
    // - Returns a bvec3 with the component-wise
    //   lesser or equal than comparison.
    //
    vec3Lteq: function(a, b)
    {
        var c =
        {
            x: false,
            y: false,
            z: false
        };
        
        if (a.x <= b.x)
            c.x = true;
        
        if (a.y <= b.y)
            c.y = true;
        
        if (a.z <= b.z)
            c.z = true;
        
        return c;
    },

    // bvec3
    // - Returns a bvec3 with the value b
    //   in all its components.
    //
    bvec3: function(b)
    {
        var r = 
        {
            x: b,
            y: b,
            z: b
        };
        
        return r;
    },

    // bvec3Reduce
    // - Reduces the comparation of two bvec3
    //   variables.
    //
    bvec3Reduce: function(a,b)
    {
        return a.x == b.x && a.y == b.y && a.z == b.z;
    }
}
