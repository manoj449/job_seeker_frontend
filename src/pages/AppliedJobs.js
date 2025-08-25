import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AppliedJobs() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/applications/me');
      setApps(data.applications);
    })();
  }, []);

  return (
    <div className="container py-4">
      <h4 className="mb-3">Applied Jobs</h4>
      <div className="list-group">
        {apps.map(a => (
          <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">{a.title} · {a.company}</div>
              <div className="small text-muted">{a.location}</div>
            </div>
            <div className="small text-muted">{new Date(a.applied_at).toLocaleDateString()}</div>
          </div>
        ))}
        {!apps.length && <div className="text-muted">No applications yet.</div>}
      </div>
    </div>
  );
}
