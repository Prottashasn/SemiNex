import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Seminar states
  const [seminars, setSeminars] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [seminarForm, setSeminarForm] = useState({
    title: '',
    speaker: '',
    topic: '',
    description: '',
    venue: ''
  });
  const [scheduleForm, setScheduleForm] = useState({
    seminarId: '',
    date: '',
    time: ''
  });
  const [speakerForm, setSpeakerForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    bio: '',
    expertise: '',
    experience: '',
    linkedin: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchSeminars();
    fetchSchedules();
    fetchSpeakers();
  }, [onLogout]);

  const fetchSeminars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/seminars');
      setSeminars(response.data.seminars);
    } catch (error) {
      console.error('Error fetching seminars:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules');
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchSpeakers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/speakers');
      setSpeakers(response.data.speakers);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    }
  };

  const handleSeminarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/seminars', seminarForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Seminar created successfully!');
      setSeminarForm({ title: '', speaker: '', topic: '', description: '', venue: '' });
      fetchSeminars();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create seminar');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/schedules', scheduleForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Schedule created successfully!');
      setScheduleForm({ seminarId: '', date: '', time: '' });
      fetchSchedules();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create schedule');
    }
  };

  const handleDeleteSeminar = async (seminarId) => {
    if (window.confirm('Are you sure you want to delete this seminar?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/seminars/${seminarId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSuccess('Seminar deleted successfully!');
        fetchSeminars();
        fetchSchedules();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete seminar');
      }
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/schedules/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSuccess('Schedule deleted successfully!');
        fetchSchedules();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete schedule');
      }
    }
  };

  const handleSpeakerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/speakers', speakerForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Speaker created successfully!');
      setSpeakerForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        designation: '',
        bio: '',
        expertise: '',
        experience: '',
        linkedin: '',
        website: ''
      });
      fetchSpeakers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create speaker');
    }
  };

  const handleDeleteSpeaker = async (speakerId) => {
    if (window.confirm('Are you sure you want to delete this speaker?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/speakers/${speakerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSuccess('Speaker deleted successfully!');
        fetchSpeakers();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete speaker');
      }
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info-header">
          <h1>Admin Dashboard</h1>
          <div className="user-details">
            <p><strong>Email:</strong> {profile?.email || user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-button ${activeTab === 'speakers' ? 'active' : ''}`}
          onClick={() => setActiveTab('speakers')}
        >
          Manage Speakers
        </button>
        <button 
          className={`nav-button ${activeTab === 'seminars' ? 'active' : ''}`}
          onClick={() => setActiveTab('seminars')}
        >
          Manage Seminars
        </button>
        <button 
          className={`nav-button ${activeTab === 'schedules' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedules')}
        >
          Manage Schedules
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="welcome-section">
            <h2>Welcome to Admin Dashboard!</h2>
            <p>You have successfully logged in. This is your admin dashboard.</p>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Speakers</h3>
                <p className="stat-number">{speakers.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Seminars</h3>
                <p className="stat-number">{seminars.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Schedules</h3>
                <p className="stat-number">{schedules.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seminars' && (
          <div className="seminar-section">
            <div className="section-header">
              <h2>Create New Seminar</h2>
            </div>
            
            <form onSubmit={handleSeminarSubmit} className="seminar-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={seminarForm.title}
                  onChange={(e) => setSeminarForm({...seminarForm, title: e.target.value})}
                  required
                  placeholder="Enter seminar title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="speaker">Speaker</label>
                <input
                  type="text"
                  id="speaker"
                  value={seminarForm.speaker}
                  onChange={(e) => setSeminarForm({...seminarForm, speaker: e.target.value})}
                  required
                  placeholder="Enter speaker name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <input
                  type="text"
                  id="topic"
                  value={seminarForm.topic}
                  onChange={(e) => setSeminarForm({...seminarForm, topic: e.target.value})}
                  required
                  placeholder="Enter seminar topic"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={seminarForm.description}
                  onChange={(e) => setSeminarForm({...seminarForm, description: e.target.value})}
                  required
                  placeholder="Enter seminar description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="venue">Venue</label>
                <input
                  type="text"
                  id="venue"
                  value={seminarForm.venue}
                  onChange={(e) => setSeminarForm({...seminarForm, venue: e.target.value})}
                  required
                  placeholder="Enter seminar venue"
                />
              </div>

              <button type="submit" className="submit-button">
                Create Seminar
              </button>
            </form>

            <div className="section-header">
              <h2>All Seminars</h2>
            </div>

            <div className="seminars-grid">
              {seminars.map((seminar) => (
                <div key={seminar._id} className="seminar-card">
                  <h3>{seminar.title}</h3>
                  <p><strong>Speaker:</strong> {seminar.speaker}</p>
                  <p><strong>Topic:</strong> {seminar.topic}</p>
                  <p><strong>Description:</strong> {seminar.description}</p>
                  <p><strong>Venue:</strong> {seminar.venue}</p>
                  <button 
                    onClick={() => handleDeleteSeminar(seminar._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'speakers' && (
          <div className="speaker-section">
            <div className="section-header">
              <h2>Create New Speaker</h2>
            </div>
            
            <form onSubmit={handleSpeakerSubmit} className="speaker-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={speakerForm.name}
                  onChange={(e) => setSpeakerForm({...speakerForm, name: e.target.value})}
                  required
                  placeholder="Enter speaker name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={speakerForm.email}
                  onChange={(e) => setSpeakerForm({...speakerForm, email: e.target.value})}
                  required
                  placeholder="Enter speaker email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={speakerForm.phone}
                  onChange={(e) => setSpeakerForm({...speakerForm, phone: e.target.value})}
                  placeholder="Enter speaker phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="organization">Organization</label>
                <input
                  type="text"
                  id="organization"
                  value={speakerForm.organization}
                  onChange={(e) => setSpeakerForm({...speakerForm, organization: e.target.value})}
                  required
                  placeholder="Enter organization name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  type="text"
                  id="designation"
                  value={speakerForm.designation}
                  onChange={(e) => setSpeakerForm({...speakerForm, designation: e.target.value})}
                  required
                  placeholder="Enter designation/role"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={speakerForm.bio}
                  onChange={(e) => setSpeakerForm({...speakerForm, bio: e.target.value})}
                  required
                  placeholder="Enter speaker biography"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="expertise">Expertise</label>
                <input
                  type="text"
                  id="expertise"
                  value={speakerForm.expertise}
                  onChange={(e) => setSpeakerForm({...speakerForm, expertise: e.target.value})}
                  required
                  placeholder="Enter areas of expertise"
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">Experience</label>
                <input
                  type="text"
                  id="experience"
                  value={speakerForm.experience}
                  onChange={(e) => setSpeakerForm({...speakerForm, experience: e.target.value})}
                  required
                  placeholder="Enter years of experience"
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn Profile</label>
                <input
                  type="url"
                  id="linkedin"
                  value={speakerForm.linkedin}
                  onChange={(e) => setSpeakerForm({...speakerForm, linkedin: e.target.value})}
                  placeholder="Enter LinkedIn profile URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  value={speakerForm.website}
                  onChange={(e) => setSpeakerForm({...speakerForm, website: e.target.value})}
                  placeholder="Enter personal website URL"
                />
              </div>

              <button type="submit" className="submit-button">
                Create Speaker
              </button>
            </form>

            <div className="section-header">
              <h2>All Speakers</h2>
            </div>

            <div className="speakers-grid">
              {speakers.map((speaker) => (
                <div key={speaker._id} className="speaker-card">
                  <h3>{speaker.name}</h3>
                  <p><strong>Email:</strong> {speaker.email}</p>
                  <p><strong>Phone:</strong> {speaker.phone || 'Not provided'}</p>
                  <p><strong>Organization:</strong> {speaker.organization}</p>
                  <p><strong>Designation:</strong> {speaker.designation}</p>
                  <p><strong>Bio:</strong> {speaker.bio}</p>
                  <p><strong>Expertise:</strong> {speaker.expertise}</p>
                  <p><strong>Experience:</strong> {speaker.experience}</p>
                  {speaker.linkedin && <p><strong>LinkedIn:</strong> <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer">View Profile</a></p>}
                  {speaker.website && <p><strong>Website:</strong> <a href={speaker.website} target="_blank" rel="noopener noreferrer">Visit Website</a></p>}
                  <button 
                    onClick={() => handleDeleteSpeaker(speaker._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="schedule-section">
            <div className="section-header">
              <h2>Create New Schedule</h2>
            </div>
            
            <form onSubmit={handleScheduleSubmit} className="schedule-form">
              <div className="form-group">
                <label htmlFor="seminarId">Select Seminar</label>
                <select
                  id="seminarId"
                  value={scheduleForm.seminarId}
                  onChange={(e) => setScheduleForm({...scheduleForm, seminarId: e.target.value})}
                  required
                >
                  <option value="">Choose a seminar</option>
                  {seminars.map((seminar) => (
                    <option key={seminar._id} value={seminar._id}>
                      {seminar.title} - {seminar.speaker}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Create Schedule
              </button>
            </form>

            <div className="section-header">
              <h2>All Schedules</h2>
            </div>

            <div className="schedules-grid">
              {schedules.map((schedule) => (
                <div key={schedule._id} className="schedule-card">
                  <h3>{schedule.seminarId?.title}</h3>
                  <p><strong>Speaker:</strong> {schedule.seminarId?.speaker}</p>
                  <p><strong>Topic:</strong> {schedule.seminarId?.topic}</p>
                  <p><strong>Date:</strong> {new Date(schedule.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {schedule.time}</p>
                  <button 
                    onClick={() => handleDeleteSchedule(schedule._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
