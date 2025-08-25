import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/jobs/' + id);
      setJob(data.job);
    })();
  }, [id]);

  const apply = async () => {
    try {
      await axios.post('/api/applications', { job_id: id });
      setMsg('Applied successfully');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Failed to apply');
    }
  };

  if (!job) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-body">
              <h3 className="mb-1">{job.title}</h3>
              <div className="text-muted">{job.company} • {job.location}</div>
              <div className="small text-muted mt-1">Posted: {new Date(job.posted_at).toLocaleDateString()} • Openings: {job.openings}</div>
              <hr/>
              <h5>Job Description</h5>
              <p style={{whiteSpace:'pre-wrap'}}>{job.description}</p>
              <h6>Required Skills</h6>
              <p>{job.skills}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="mb-2"><strong>Type:</strong> {job.type}</div>
              <div className="mb-2"><strong>Experience:</strong> {job.min_experience}+ years</div>
              {(job.salary_min || job.salary_max) && (
                <div className="mb-2"><strong>Salary:</strong> ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}</div>
              )}
              <div className="mb-2"><strong>Expires:</strong> {job.expires_at ? new Date(job.expires_at).toLocaleDateString() : '—'}</div>
              <button className="btn btn-primary w-100 mt-2" onClick={apply}>Apply</button>
              {msg && <div className="alert alert-info mt-3 p-2">{msg}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
