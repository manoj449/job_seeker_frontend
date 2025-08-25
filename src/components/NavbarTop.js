import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavbarTop() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">Skillify and Placify</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          {user && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link className="nav-link" to="/jobs">Jobs</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/applied">Applied</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            </ul>
          )}
          <div className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="small text-muted">Hello, {user.name}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login">Login</Link>
                <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
