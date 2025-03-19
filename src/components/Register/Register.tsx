import React, { useState } from 'react';
//import { Buffer } from 'buffer';
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



function Register()
{
    const [message,setMessage] = useState('');
    
    const [firstName,setFirstName] = React.useState('');
    const [lastName,setLastName] = React.useState('');
    const [registerEmail,setEmail] = React.useState('');
    const [registerUserName,setRegisterName] = React.useState('');
    const [registerPassword,setRegisterPassword] = React.useState('');

    // register credentials validator
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    function validateRegister(): boolean {
        let valid = true;

        if (!isEmail.validate(registerEmail)) {
            setEmailError('Invalid email format.');
            valid = false;
        } else {
            setEmailError('');
        }

        if (registerUserName.trim() === '') {
            setUsernameError('Username cannot be empty.');
            valid = false;
            /*
                add username check to see if username already exists
            */
        } else {
            setUsernameError('');
        }

        if (registerPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    }
    

    async function doRegister(event:any) : Promise<void>
    {
        event.preventDefault();

        if(!validateRegister()) {
            return;
        }

        var obj = {first:firstName, last:lastName, regemail:registerEmail, regname:registerUserName, regpassword:registerPassword}
        var js = JSON.stringify(obj);

        try
        {
            setMessage("Test"); //this is stupid
            const response = await fetch(buildPath('/api/register'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
            console.log(response);
            //var res = JSON.parse(await response.text());

            window.location.href = '/registerComplete';

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

    function backToLogin()
    {
        window.location.href = '/login';
    }

    return(
        <div id = "signupDiv" className="signup-container">
            
        <h2>Sign Up Below</h2>

            <div className="form-group">
                <label htmlFor="registerEmail">Email</label>
                <input type="text" id="registerEmail" placeholder="Enter Email" value={registerEmail}
                    onChange={handleSetRegisterEmail} />
                {emailError && <span className="error-message">{emailError}</span>}
            </div>

        
            <div className="form-group">
                <label htmlFor="registerUserName">Login</label>
                <input type="text" id="registerUserName" placeholder="New Username" value={registerUserName}
                    onChange={handleSetRegisterUserName} />
                {usernameError && <span className="error-message">{usernameError}</span>}
            </div>


            <div className="form-group">
                <label htmlFor="registerPassword">Password</label>
                <input type="password" id="registerPassword" placeholder="New Password" value={registerPassword}
                    onChange={handleSetRegisterPassword} />
                {passwordError && <span className="error-message">{passwordError}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="registerFirstName">First Name</label>
                <input type="text" id="registerFirstName" placeholder="First Name" value={firstName}
                    onChange={handleSetRegisterFirstName} />
            </div>

            <div className="form-group">
                <label htmlFor="registerLastName">Last Name</label>
                <input type="text" id="registerLastName" placeholder="Last Name" value={lastName}
                    onChange={handleSetRegisterLastName} />
            </div>

                
            {/* <input type="submit" id="registerButton" className="buttons" value = "Get Goin"
                onClick={doRegister} /> */}
            <button id="registerButton" onClick={doRegister}>Get Goin</button> 
            <button id="loginButton" onClick={backToLogin}>Back to Login</button>
        
            <span id="loginResult">{message}</span>
        </div>
    );
};
export default Register;
  
