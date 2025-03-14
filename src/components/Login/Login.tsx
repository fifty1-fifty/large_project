import React, { useState } from 'react';
import "./Login.css";
//import isEmail from 'isemail';


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


function Login()
{
    console.log("im gat");
    const [message,setMessage] = useState('');

    const [emailName,setLoginEmail] = React.useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

   
    async function doLogin(event:any) : Promise<void>
    {
	    console.log("im gat");
        	event.preventDefault();
        	var obj = {login:loginName,password:loginPassword,email:emailName};
        	var js = JSON.stringify(obj);
        	try
       		{
           		 const response = await fetch(buildPath('/api/login'),
            		{method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
           		 var res = JSON.parse(await response.text());


           		 console.log(res.id);
            
           		 if( res.id <= 0 )
           		 {
               			 setMessage('User/Password combination incorrect');
               			 return;
           		 }
           		 else
           		 {
	             		   var user =
            	  		  {firstName:res.firstName,lastName:res.lastName,id:res.id}
              			  localStorage.setItem('user_data', JSON.stringify(user));
             			   setMessage('');
              			  window.location.href = '/cards';
            		 }
       		 }
       		 catch(error:any)
       		 {
            		alert(error.toString());
           		 return;
        	}
    };


  /*  async function newLogin(newLoginData:JSON) : Promise<void>
    {
        var obj = newLoginData
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('/api/login'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
            var res = JSON.parse(await response.text());

            if( res.id <= 0)
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user =
                {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/cards';
             }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
     };*/

    function handleSetLoginName( e: any ) : void
    {   
        setLoginName( e.target.value );
    }

    function handleSetPassword( e: any ) : void
    {
        setPassword( e.target.value );
    }

    function handleSetLoginEmail( e: any ) : void
    {
        setLoginEmail( e.target.value );
    }

	
    return(
        <div id="loginDiv" className="login-container">
  <h2>Login</h2>

  <div className="form-group">
    <label htmlFor="emailName">Email address</label>
    <input type="text" id="emailName" placeholder="Email"
      onChange={handleSetLoginEmail} />
  </div>

  <div className="form-group">
    <label htmlFor="loginName">Username</label>
    <input type="text" id="loginName" placeholder="Username"
      onChange={handleSetLoginName} />
  </div>

  <div className="form-group">
    <label htmlFor="loginPassword">Password</label>
    <input type="password" id="loginPassword" placeholder="Password"
      onChange={handleSetPassword} />
  </div>

  <button id="loginButton" onClick={doLogin}>Login</button>
  <button id="signupButton">Signup Here</button>

  <span id="loginResult">{message}</span>
</div>

	    );
}
export default Login;
