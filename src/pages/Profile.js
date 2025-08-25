import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

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
    const { data } = await axios.post('/api/users/me/photo', form, { headers: { 'Content-Type':'multipart/form-data' } });
    setMsg('Photo uploaded');
    setPhotoPreview(null);
    load();
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
              <input type="file" className="form-control" onChange={(e)=>{ setPhotoPreview(URL.createObjectURL(e.target.files[0])); uploadPhoto(e); }}/>
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
                <div className="col-12">
                  <label className="form-label">Resume URL (Drive/Link)</label>
                  <input className="form-control" value={profile.resume_url||''} onChange={e=>setProfile({...profile, resume_url:e.target.value})} />
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
