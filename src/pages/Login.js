import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5" style={{maxWidth: 480}}>
      <h3 className="mb-3">Login</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <form onSubmit={submit} className="vstack gap-3">
        <input className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary">Login</button>
      </form>
      <p className="mt-3 small">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
