//import React, { useState } from 'react';
import isEmail from 'isemail';


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

function doRegister()
{
   const [firstName,setFirstName] = React.useState('');
   const [lastName,setLastName] = React.useState('');
   const [registerEmail,setEmail] = React.useState('');
   const [registerUserName,setRegisterName] = React.useState('');
   const [registerPassword,setRegisterPassword] = React.useState('');

  async function doRegister(event:any) : Promise<void>
  {
      event.preventDefault();

      if(!isEmail.validate(registerEmail)) {
          setMessage("Invalid email");
          return;
      }

      var obj = {first:firstName, last:lastName, email:registerEmail, regname:registerUserName, regpassword:registerPassword}
      var js = JSON.stringify(obj);

      try
      {
          const response = await fetch(buildPath('/api/register'),
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
          var res = JSON.parse(await response.text());

      }
        
      catch(error:any)
      {
          alert(error.toString());
          return;
      }
  };

  function handleSetRegisterFirstName( e: any ) : void
  {
      setFirstName( e.target.value );
  }

  function handleSetRegisterLastName( e: any ) : void
  {
      setLastName( e.target.value );
  }

  function handleSetRegisterEmail( e: any ) : void
  {        
      setEmail(e.target.value); 
  }

  function handleSetRegisterUserName( e: any ) : void
  {
      setRegisterName( e.target.value );
  }

  function handleSetRegisterPassword( e: any ) : void
  {
      setRegisterPassword( e.target.value );
  }

  return(
    <div id = "signupDiv">
    <span id="inner-title">Registration</span><br />

            First Name: <input type="text" id="registerFirstName" placeholder="First Name" value={firstName}
                onChange={handleSetRegisterFirstName} />

            <br /> 

            Last Name: <input type="text" id="registerLastName" placeholder="Last Name" value={lastName}
                onChange={handleSetRegisterLastName} />

            <br />

            Email: <input type="text" id="registerEmail" placeholder="Enter Email" value={registerEmail}
                onChange={handleSetRegisterEmail} />

            <br /> 

            Username: <input type="text" id="registerUserName" placeholder="New Username" value={registerUserName}
                onChange={handleSetRegisterUserName} />

            <br /> 

            Password: <input type="password" id="registerPassword" placeholder="New Password" value={registerPassword}
                onChange={handleSetRegisterPassword} />

            <br /> 

            <input type="submit" id="registerButton" className="buttons" value = "Get Goin"
                onClick={doRegister} />    
        
         <span id="signupResult">{message}</span>
        </div>
        );
}
  
