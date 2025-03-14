import React, { useState } from 'react';
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
        <div id="loginDiv" className="container-fluid flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg max-w-sm mx-auto">
  <h2 className="text-2xl font-semibold mb-4">Login</h2>

  <div className="w-full mb-4">
    <label htmlFor="emailName" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
    <input type="text" id="emailName" placeholder="Email"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      onChange={handleSetLoginEmail} />
  </div>

  <div className="w-full mb-4">
    <label htmlFor="loginName" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
    <input type="text" id="loginName" placeholder="Username"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      onChange={handleSetLoginName} />
  </div>

  <div className="w-full mb-4">
    <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
    <input type="password" id="loginPassword" placeholder="Password"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      onChange={handleSetPassword} />
  </div>

  <button id="loginButton"
    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
    onClick={doLogin}>Login</button>

  <button id="signupButton"
    className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition duration-200 mt-3">Signup Here</button>

  <span id="loginResult" className="text-red-500 mt-3">{message}</span>
</div>
}
export default Login;
