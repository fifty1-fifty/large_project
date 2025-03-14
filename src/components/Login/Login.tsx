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
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	</link> </head>   

        <div id="loginDiv" class="container-fluid">
            <span id="inner-title">Login</span><br />

            Email: <input type="text" id="emailName" placeholder="Email"
                onChange={handleSetLoginEmail} />

            <br /> 
            
            Username: <input type="text" id="loginName" placeholder="Username"
                onChange={handleSetLoginName} />

            <br /> 
            
            Password: <input type="password" id="loginPassword" placeholder="Password"
                onChange={handleSetPassword} />

            <br /> 

            <input type="submit" id="loginButton" className="buttons" value = "Do It"
                onClick={doLogin} />
 
            <span id="loginResult">{message}</span> 
        </div>
        );
}
export default Login;
