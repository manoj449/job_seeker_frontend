import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState([]);
  const [matchStats, setMatchStats] = useState({
    overall: 0,
    experience: 0,
    location: 0
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/jobs');
        setJobs(data.jobs.slice(0,5));

        const a = await axios.get('/api/applications/me');
        setApplied(a.data.applications.slice(0,5));

        // Fetch profile match stats from backend (you need to implement /api/users/match)
        const stats = await axios.get('/api/users/match');
        setMatchStats(stats.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const getChartData = (value) => ({
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#0d6efd', '#e9ecef'],
        borderWidth: 0
      }
    ]
  });

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <img alt="profile" className="rounded-circle mb-3" width="96" height="96"
                  src={user?.photo_url ? (process.env.REACT_APP_API + user.photo_url) : 'https://via.placeholder.com/96'} />
              <h5 className="card-title">{user?.name}</h5>
              <p className="text-muted small mb-3">{user?.email}</p>
              <Link to="/profile" className="btn btn-outline-primary btn-sm">Edit Profile</Link>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="col-lg-9">
          <div className="row g-4">

            {/* Match Stats Cards */}
            <div className="col-12">
              <div className="card p-3">
                <h5 className="mb-3">How your applies matched your profile in last 7 days?</h5>
                <div className="d-flex gap-3 justify-content-start">
                  
                  <div className="text-center" style={{ width: '100px' }}>
                    <Doughnut data={getChartData(matchStats.overall)} options={chartOptions} />
                    <div className="mt-2 fw-bold text-danger">{matchStats.overall < 40 ? 'LOW' : matchStats.overall < 70 ? 'MEDIUM' : 'HIGH'}</div>
                    <div className="small text-muted">{applied.length} applied</div>
                  </div>

                  <div className="text-center" style={{ width: '100px' }}>
                    <Doughnut data={getChartData(matchStats.experience)} options={chartOptions} />
                    <div className="mt-2 fw-bold">Experience</div>
                    <div className="small text-muted">{matchStats.experience}% match</div>
                  </div>

                  <div className="text-center" style={{ width: '100px' }}>
                    <Doughnut data={getChartData(matchStats.location)} options={chartOptions} />
                    <div className="mt-2 fw-bold">Location</div>
                    <div className="small text-muted">{matchStats.location}% match</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Suggested Jobs */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Suggested Jobs</h5>
                  <div className="list-group">
                    {jobs.map(j => (
                      <Link key={j.id} className="list-group-item list-group-item-action" to={`/jobs/${j.id}`}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-semibold">{j.title} · {j.company}</div>
                            <div className="small text-muted">{j.location} • Openings: {j.openings}</div>
                          </div>
                          <div className="small text-muted">Posted: {new Date(j.posted_at).toLocaleDateString()}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Applied */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Recently Applied</h5>
                  {applied.length ? (
                    <ul className="list-group">
                      {applied.map(a => (
                        <li key={a.id} className="list-group-item d-flex justify-content-between">
                          <span>{a.title} @ {a.company}</span>
                          <span className="small text-muted">{new Date(a.applied_at).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-muted mb-0">No applications yet.</p>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
