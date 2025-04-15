import { useState, useEffect } from 'react';
import { buildPath } from '../../utils';;
import "./ResetPassword.css";

const ResetPasswordFlow = () => {
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // If token is present in the URL, switch to password reset step
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setStep('reset');
    }
  }, []);

  // Step 1: Request password reset
  const handleEmailSubmit = async (e : any) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(buildPath('/api/requestReset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Password reset link sent! Check your inbox.');
      } else {
        setMessage(data.error || '❌ Something went wrong.');
      }
    } catch (err) {
      setMessage('❌ Failed to send request.');
    }
  };

  // Step 2: Reset password using token
  const handlePasswordReset = async (e : any) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(buildPath('/api/resetPassword'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Password has been reset successfully!');
      } else {
        setMessage(data.error || '❌ Reset failed.');
      }
    } catch (err) {
      setMessage('❌ Failed to reset password.');
    }
  };

  return (
    <div className="reset-password-container">
      {step === 'email' && (
        <>
          <h2>Request Password Reset</h2>
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Link</button>
          </form>
        </>
      )}

      {step === 'reset' && (
        <>
          <h2>Reset Your Password</h2>
          <form onSubmit={handlePasswordReset}>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        </>
      )}

      {message && <p className="response-message">{message}</p>}
    </div>
  );
};

export default ResetPasswordFlow;
