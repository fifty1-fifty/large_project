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


function Login()
{
    const [message,setMessage] = useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    const [firstName,setFirstName] = React.useState('');
    const [lastName,setLastName] = React.useState('');
    const [registerUserName,setRegisternName] = React.useState('');
    const [registerPassword,setRegisterPassword] = React.useState('');
    

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();
        var obj = {login:loginName,password:loginPassword};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('/api/login'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
            var res = JSON.parse(await response.text());

            if( res.id <= 0 )
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

     async function newLogin(newLoginData:JSON) : Promise<void>
    {
        var obj = newLoginData
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('/api/login'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
            var res = JSON.parse(await response.text());

            if( res.id <= 0 )
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





    async function doRegister(event:any) : Promise<void>
    {
        event.preventDefault();
        var obj = {first:firstName,last:lastName,regname:registerUserName ,regpassword:registerPassword}
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

    function handleSetRegisterFirstName( e: any ) : void
    {
        setFirstName( e.target.value );
    }

    function handleSetRegisterLastName( e: any ) : void
    {
        setLastName( e.target.value );
    }

    function handleSetRegisterUserName( e: any ) : void
    {
        setRegisternName( e.target.value );
    }

    function handleSetRegisterPassword( e: any ) : void
    {
        setRegisterPassword( e.target.value );
    }




    return(
        <div id="loginDiv">
            <span id="inner-title">PLEASE LOG IN</span><br />
            Login: <input type="text" id="loginName" placeholder="Username"
                onChange={handleSetLoginName} />

            Password: <input type="password" id="loginPassword" placeholder="Password"
                onChange={handleSetPassword} />

            <input type="submit" id="loginButton" className="buttons" value = "Do It"
                onClick={doLogin} />
 
            <span id="loginResult">{message}</span>



            <br /> <br /> <br /> 

            <span id="inner-title">GET REGISTRATED FUCKER</span><br />

            First Name: <input type="text" id="registerFirstName" placeholder="New First Name"
                onChange={handleSetRegisterFirstName} />

            Last Name: <input type="text" id="registerLastName" placeholder="New Last Name"
                onChange={handleSetRegisterLastName} />

            <br /> <br />

            Username: <input type="text" id="registerUserName" placeholder="New Username"
                onChange={handleSetRegisterUserName} />

            Password: <input type="password" id="registerPassword" placeholder="New Password"
                onChange={handleSetRegisterPassword} />

            <input type="submit" id="registerButton" className="buttons" value = "Get Goin"
                onClick={doRegister} />    

        
            
        </div>
        );
};
export default Login;