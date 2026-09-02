import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { adminLogin, setToken, getToken } from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (getToken()) navigate('/admin', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await adminLogin(username, password);
      setToken(res.token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-4">
            <LockKeyhole className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Do You Travel — Package Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          This is a separate area for site administrators only.
        </p>
      </div>
    </div>
  );
}
