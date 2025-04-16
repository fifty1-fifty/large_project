import { useEffect } from 'react';

const RegisterComplete = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/login';
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    return (
        <div>
            <h2>Registration Complete. Please click the link sent to the email address provided to get started.</h2>
        </div>
    );
};

export default RegisterComplete;
