import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  const load = async () => {
    const { data } = await axios.get('/api/users/me');
    setProfile(data.profile);
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...profile };
    try {
      await axios.put('/api/users/me', payload);
      setMsg('Profile updated successfully');
      load();
    } catch (e) {
      setMsg('Update failed');
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('photo', file);
    try {
      await axios.post('/api/users/me/photo', form, { headers: { 'Content-Type':'multipart/form-data' } });
      setMsg('Photo uploaded');
      setPhotoPreview(null);
      load();
    } catch (err) {
      setMsg('Photo upload failed');
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('resume', file);
    try {
      await axios.post('/api/users/me/resume', form, { headers: { 'Content-Type':'multipart/form-data' } });
      setMsg('Resume uploaded');
      setResumePreview(file.name);
      load();
    } catch (err) {
      setMsg('Resume upload failed');
    }
  };

  if (!profile) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card">
            <div className="card-body text-center">
              <img className="rounded-circle mb-3" width="120" height="120"
                src={profile.photo_url ? (process.env.REACT_APP_API + profile.photo_url) : 'https://via.placeholder.com/120'} alt="profile" />
              <input type="file" className="form-control mt-2" onChange={(e)=>{ setPhotoPreview(URL.createObjectURL(e.target.files[0])); uploadPhoto(e); }}/>
              {photoPreview && <img className="mt-2 rounded" alt="preview" width="120" src={photoPreview} />}
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profile Details</h5>
              {msg && <div className="alert alert-info p-2">{msg}</div>}
              <form onSubmit={save} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={profile.name||''} onChange={e=>setProfile({...profile, name:e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input disabled className="form-control" value={profile.email||''} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={profile.phone||''} onChange={e=>setProfile({...profile, phone:e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Experience (years)</label>
                  <input type="number" className="form-control" value={profile.experience_years||0} onChange={e=>setProfile({...profile, experience_years:e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">Skills (comma separated)</label>
                  <input className="form-control" value={profile.skills||''} onChange={e=>setProfile({...profile, skills:e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">Education</label>
                  <textarea className="form-control" value={profile.education||''} onChange={e=>setProfile({...profile, education:e.target.value})} />
                </div>

                {/* Resume Upload */}
                <div className="col-12">
                  <label className="form-label">Resume (Word/PDF)</label>
                  <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={uploadResume} />
                  {profile.resume_url && <a className="d-block mt-1" href={process.env.REACT_APP_API + profile.resume_url} target="_blank" rel="noopener noreferrer">View Current Resume</a>}
                  {resumePreview && <span className="d-block mt-1">Uploaded: {resumePreview}</span>}
                </div>

                <div className="col-12 text-end">
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
