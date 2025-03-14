import React, { useState } from 'react';

const app_name = 'group22cop4331c.xyz';
function buildPath(route:string) : string
{
    if (process.env.NODE_ENV != 'development')
    {
        return 'http://' + app_name + route;
    }
    else
    {
        return 'http://localhost:5000/' + route;
    }
}


function Home()
{
    console.log("im gat");
    
    return(
        <div id="homeDiv">
          <span id="inner-title">This is a blank description of what this website will be login in m8</span><br />

            Login <br />
            <input type="submit" id="loginButton" className="buttons" value = "Login"
                onClick={gotoLogin} />

            Signup <br />
            <input type="submit" id="singupButton" className="buttons" value = "Register"
                onClick={gotoSignup} />
            
        </div>
        );
};
export default Home;
