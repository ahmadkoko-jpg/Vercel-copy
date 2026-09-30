import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl font-bold tracking-tight">{isLogin ? 'Log in' : 'Create your account'}</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {!isLogin && (
          <label className="block">
            <span className="mb-1 block text-sm">Full name</span>
            <input className="field" required value={form.name} onChange={set('name')} autoComplete="name" />
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-sm">Email</span>
          <input className="field" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Password</span>
          <input
            className="field"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={set('password')}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </label>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        {isLogin ? (
          <>New here? <Link to="/register" state={location.state} className="text-cobalt underline">Create an account</Link></>
        ) : (
          <>Already registered? <Link to="/login" state={location.state} className="text-cobalt underline">Log in</Link></>
        )}
      </p>
    </div>
  );
}
