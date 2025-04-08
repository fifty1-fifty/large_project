import React, { useState } from 'react';
import "./Login.css";
import home from "./home.png";
import isEmail from 'isemail';
import { buildPath } from '../../utils'; 

function Login()
{
    console.log("im gat");

    const [emailName,setLoginEmail] = React.useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    //login credentials validator
    const [emailError, setEmailError] = useState(' ');
    const [usernameError, setUsernameError] = useState(' ');
    const [passwordError, setPasswordError] = useState(' ');


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
            setPasswordError('Password must be at least 6 characters.');
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
                return;
            }
            else
            {
                var user =
                {firstName:res.firstName,lastName:res.lastName,id:res.id,token}
                localStorage.setItem('user_data', JSON.stringify(user));
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

    function goToRegister()
    {	
	    window.location.href = '/register';
    }

	
    return(
        <div className="row" id="background">

        <div className="col" id="fade-in">
             <div className="photo-card">
                <img src={home} style={{ maxWidth: "550px", maxHeight: "500px", objectFit: "cover", borderRadius: "5px" }}/>
            </div>
        </div>

        <div className="col" id="fade-in">
            <div className="login-container">

                <div className="form-group" id="getridoftheannoyingbackground">
                     <input type="text" id="input" placeholder="Email or Username"
                      onChange={handleSetLoginEmail} />
                 </div>

                <div className="form-group" id="getridoftheannoyingbackground">
                    <input type="text" id="input" placeholder="Username"
                    onChange={handleSetLoginName} />
                </div>

                <div className="form-group" id="getridoftheannoyingbackground">
                    <input type="password" id="input" placeholder="Password"
                     onChange={handleSetPassword} />
                 </div>

                <button className="loginButton" onClick={doLogin}>Login</button>

                <div className="form-group" id="error-dv">
                     {emailError && <span className="error-mess" id="error" >{emailError}</span>}
		              {usernameError && <span className="error-mess" id="error" >{usernameError}</span>}
		              {passwordError && <span className="error-mess" id="error" >{passwordError}</span>}
                </div>


		     
               
                    <h2 id="signupLabel">Don't have an account? </h2>
                    <button className="signupButton" onClick={goToRegister}>Register Here</button>
	
            </div>
        </div>
     </div>

        
	);
}
export default Login;
