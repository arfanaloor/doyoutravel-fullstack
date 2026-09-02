import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, clearToken, verifyAdminToken } from '../lib/api';

// Checks for a stored token and verifies it against the backend. Redirects to
// the admin login screen if there isn't a valid session.
export function useAdminAuth() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // checking | authed | denied
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const token = getToken();
    if (!token) {
      setStatus('denied');
      navigate('/admin/login', { replace: true });
      return;
    }
    verifyAdminToken()
      .then((res) => {
        if (cancelled) return;
        setUsername(res.username);
        setStatus('authed');
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setStatus('denied');
        navigate('/admin/login', { replace: true });
      });
    return () => { cancelled = true; };
  }, [navigate]);

  const logout = useCallback(() => {
    clearToken();
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  return { status, username, logout };
}
