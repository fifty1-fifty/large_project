import { useState, useEffect } from 'react';
import { buildPath } from '../../utils';
import "./ResetPassword.css";

const ResetPasswordFlow = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Check URL for token
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setStep('reset');
    }
  }, []);

  // Step 1: Request password reset
  const handleEmailSubmit = async (e: React.FormEvent) => {
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
        setMessage('Password reset link sent! Check your inbox.');

        setTimeout(() => {
          window.location.href = '/login';
        }, 3000); // redirect after 3 seconds
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Failed to send request.');
    }
  };

  // Step 2: Reset password using token
  const handlePasswordReset = async (e: React.FormEvent) => {
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
        setMessage('✅ Password has been reset successfully! Redirecting...');

        setTimeout(() => {
          window.location.href = '/login';
        }, 3000); // redirect after 3 seconds
      } else {
        setMessage(data.error || 'Reset failed.');
      }
    } catch (err) {
      setMessage('❌ Failed to reset password.');
    }
  };

  return (
    <div className="reset-password-container">
      {step === 'email' && (
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
      )}

      {step === 'reset' && (
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
      )}

      {message && <p className="response-message">{message}</p>}
    </div>
  );
};

export default ResetPasswordFlow;
