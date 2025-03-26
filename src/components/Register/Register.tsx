import React, { useState } from 'react';
import "./Register.css";
import isEmail from 'isemail';
import { buildPath } from '../../utils'; 

const Register: React.FC = () => {
    const [message, setMessage] = useState('');

    // States for attributes
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registerEmail, setEmail] = useState('');
    const [registerUserName, setRegisterName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState<File | null>(null);

    // States for errors
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

        const usernameTaken = await checkUsernameAvailability(registerUserName);
        if (usernameTaken) {
            setUsernameError(usernameTaken);
            valid = false;
        }

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
        formData.append('bio', bio);

        if (profilePic) formData.append('profilePic', profilePic);

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
                    bio
                }));
                
                window.location.href = '/home';
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

    return (
        <div className="row" id="background">
            <div className="signup-container" id="fade-in">
                <form onSubmit={doRegister}>
                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter Email" value={registerEmail}
                            onChange={(e) => setEmail(e.target.value)} />
                        {emailError && <span className="error-message">{emailError}</span>}
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter Username" value={registerUserName}
                            onChange={(e) => setRegisterName(e.target.value)} />
                        {usernameError && <span className="error-message">{usernameError}</span>}
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="password" id="input" placeholder="Enter Password" value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)} />
                        {passwordError && <span className="error-message">{passwordError}</span>}
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter First Name" value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="text" id="input" placeholder="Enter Last Name" value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <textarea id="input" placeholder="Write your bio..." value={bio} 
                            onChange={(e) => setBio(e.target.value)} />
                    </div>

                    <div className="form-group" id="getridofttheannoyingbackgroun">
                        <input type="file" accept="image/*" 
                            onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
                    </div>

                    <button type="submit" id="registerBut">Get Started</button>
                    <button type="button" id="loginButton" onClick={backToLogin}>Back to Login</button>

                    {message && <span id="loginResult">{message}</span>}
                </form>
            </div>
        </div>
    );
};

export default Register;
