import React, { useState } from 'react';
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


function Login()
{
    const [message,setMessage] = useState('');

    const [emailName,setLoginEmail] = React.useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    const [firstName,setFirstName] = React.useState('');
    const [lastName,setLastName] = React.useState('');
    const [registerEmail,setEmail] = React.useState('');
    const [registerUserName,setRegisterName] = React.useState('');
    const [registerPassword,setRegisterPassword] = React.useState('');
    

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();
        var obj = {login:loginName,password:loginPassword, email:emailName};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('/api/login'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
            var res = JSON.parse(await response.text());

            if( res.id <= 0 || res.status === 401 )
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

            newLogin(res);
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    };


    
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
        <div id="loginDiv">
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
 
        </div>
        );
};
export default Login;
