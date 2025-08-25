import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-5" style={{maxWidth: 480}}>
      <h3 className="mb-3">Register</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <form onSubmit={submit} className="vstack gap-3">
        <input className="form-control" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary">Create Account</button>
      </form>
      <p className="mt-3 small">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
