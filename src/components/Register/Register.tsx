import React, { useState } from 'react';
import "./Register.css";
import isEmail from 'isemail';
import { buildPath } from '../../utils'; 
//import { register } from 'module';

const Register: React.FC = () => {
    const [message, setMessage] = useState('');

    const storedUser = localStorage.getItem("user_data");
    const user = storedUser ? JSON.parse(storedUser) : {};
    if(user)
    {
        localStorage.clear();
    }

    // States for attributes
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registerEmail, setEmail] = useState('');
    const [registerUserName, setRegisterName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
   
    // States for errors
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    /* endpoint is not working
    // Calls check-username input to verifiy username availability
    const checkUsernameAvailability = async (username: string) => {
        const response = await fetch(buildPath('/api/check-username'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        const result = await response.json();
        return result.exists ? 'Username already taken' : '';
    };
    */

    // Async function to can use await for checkUsernameAvailability
    const validateRegister = async (): Promise<boolean> => {
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
        } else {
            setUsernameError('');
        }

        if (registerPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            valid = false;
        } else {
            setPasswordError('');
        }
        /* endpoint is not working
        const usernameTaken = await checkUsernameAvailability(registerUserName);
        if (usernameTaken) {
            setUsernameError(usernameTaken);
            valid = false;
        }
        */
        return valid;
    };

    const doRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // If valid registration, then create and append to formData
        if (!(await validateRegister())) return;

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', registerEmail);
        formData.append('username', registerUserName);
        formData.append('password', registerPassword);

        // Call registration endpoint with formData
        try {
            const response = await fetch(buildPath('/api/register'), {
                method: 'POST',
                body: formData,
            });

            const res = await response.json();

            if (!res.error) {
                localStorage.setItem('user_data', JSON.stringify({
                    firstName,
                    lastName,
                    login: registerUserName,
                    email: registerEmail,
                }));
                
                //window.location.href = '/home';
            } else {
                setMessage(res.error);
            }
        } catch (error: any) {
            setMessage(error.toString());
        }
    };

    const backToLogin = () => {
        window.location.href = '/login';
    };

    const registerComplete = () => {
        window.location.href = '/registerComplete'
    }

    return (
        <div className="row" id="background">
            <div className="signup-container" id="fade-in">
                <form onSubmit={doRegister}>
                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter Email" value={registerEmail}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter Username" value={registerUserName}
                            onChange={(e) => setRegisterName(e.target.value)} />
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="password" id="input" placeholder="Enter Password" value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)} />
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter First Name" value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter Last Name" value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <div className="form-group" id="error-are">
                        {emailError && <span className="error-message" id="err">{emailError}</span>}
                        {usernameError && <span className="error-message" id="err">{usernameError}</span>}
                        {passwordError && <span className="error-message" id="err">{passwordError}</span>}
                    </div>
                    

                    <button type="submit" id="registerBut" onClick={registerComplete}>Get Started</button>
                    <button type="button" id="loginButton" onClick={backToLogin}>Back to Login</button>

                    {message && <span id="loginResult">{message}</span>}
                </form>
            </div>
        </div>
    );
};

export default Register;
