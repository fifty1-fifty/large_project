import React, { useState } from 'react';
import "./Login.css";
import isEmail from 'isemail';
import { buildPath } from '../Path';

function Login()
{
    console.log("im gat");
    const [message,setMessage] = useState('');

    const [emailName,setLoginEmail] = React.useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    // login credentials validator
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    function validateInputs(): boolean {
        let valid = true;

        // Use isEmail for email validation
        if (!isEmail.validate(emailName)) {
            setEmailError('Invalid email format.');
            valid = false;
        } else {
            setEmailError('');
        }

        if (loginName.trim() === '') {
            setUsernameError('Username cannot be empty.');
            valid = false;
        } else {
            setUsernameError('');
        }

        if (loginPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    }
   
    async function doLogin(event:any) : Promise<void>
    {

        event.preventDefault();

        if(!validateInputs()) {
            return;
        }

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
                window.location.href = '/home';
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


    /*function handleSetLoginName( e: any ) : void
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
    }*/

    function goToRegister()
    {	
	    window.location.href = '/register';
    }

	
    return(
        <div id="loginDiv" className="login-container">
            <h2>Login</h2>

            <div className="form-group">
                <label htmlFor="emailName">Email address</label>
                <input
                    type="text"
                    id="emailName"
                    placeholder="Email"
                    value={emailName}
                    onChange={(e) => setLoginEmail(e.target.value)}
                />
                {emailError && <span className="error-message">{emailError}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="loginName">Username</label>
                <input
                    type="text"
                    id="loginName"
                    placeholder="Username"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                />
                {usernameError && <span className="error-message">{usernameError}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input
                    type="password"
                    id="loginPassword"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <span className="error-message">{passwordError}</span>}
            </div>

            <button id="loginButton" onClick={doLogin}>Login</button>
            <button id="signupButton" onClick={goToRegister}>Sign Up Here</button>

            <span id="loginResult">{message}</span>
        </div>
        
	);
}
export default Login;
