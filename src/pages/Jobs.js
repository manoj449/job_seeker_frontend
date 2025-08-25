import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [skills, setSkills] = useState('');

  const fetchJobs = async () => {
    const { data } = await axios.get('/api/jobs', { params: { q, location, type, skills } });
    setJobs(data.jobs);
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="container py-4">
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3"><input className="form-control" placeholder="Role / Company" value={q} onChange={e=>setQ(e.target.value)} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} /></div>
            <div className="col-md-3">
              <select className="form-select" value={type} onChange={e=>setType(e.target.value)}>
                <option value="">Any Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Remote</option>
                <option>Contract</option>
              </select>
            </div>
            <div className="col-md-3"><input className="form-control" placeholder="Skills (comma)" value={skills} onChange={e=>setSkills(e.target.value)} /></div>
          </div>
          <div className="text-end mt-3">
            <button className="btn btn-primary" onClick={fetchJobs}>Search</button>
          </div>
        </div>
      </div>

      <div className="vstack gap-3">
        {jobs.map(j => (
          <div key={j.id} className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{j.title} <span className="text-muted">· {j.company}</span></h5>
                <div className="small text-muted">{j.location} • Openings: {j.openings}</div>
              </div>
              <div className="text-end">
                <div className="small text-muted">Posted: {new Date(j.posted_at).toLocaleDateString()}</div>
                <Link to={`/jobs/${j.id}`} className="btn btn-outline-primary btn-sm mt-2">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
