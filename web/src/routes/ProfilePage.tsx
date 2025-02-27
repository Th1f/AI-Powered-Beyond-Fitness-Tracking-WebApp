import React, { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { fetchUserData, UserData, updateUserProfile } from '../auth/backendAuth';
import Loading from './Loading';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: 1
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchUserData();
        setUserData(data);
        setEditedData({
          name: data.user.username || '',
          age: data.user.age?.toString() || '',
          height: data.user.height?.toString() || '',
          weight: data.user.weight?.toString() || '',
          goal: data.user.email || '',
          activityLevel: data.user.exercise_info?.active_time || 1
        });
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        age: parseInt(editedData.age),
        height: parseFloat(editedData.height),
        weight: parseFloat(editedData.weight),
        exercise: userData!.user.exercise,
        diet_info: userData!.user.diet_info,
        exercise_info: {
          steps: userData!.user.exercise_info?.steps || 0,
          calories_burned: userData!.user.exercise_info?.calories_burned || 0,
          active_time: editedData.activityLevel
        }
      });
      setIsEditing(false);
      const updatedData = await fetchUserData();
      setUserData(updatedData);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  const getActivityLevelText = (level: number) => {
    switch (level) {
      case 1:
        return 'Sedentary';
      case 2:
        return 'Light';
      case 3:
        return 'Moderate';
      case 4:
        return 'Active';
      case 5:
        return 'Very Active';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p>{error}</p>;
  if (!userData) return <p>No user data available</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
        {!isEditing && (
          <button className="edit-button" onClick={handleEdit}>
            <EditIcon /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              <PersonIcon sx={{ fontSize: 48 }} />
            </div>
            <div className="profile-details">
              <h3>{userData.user.username}</h3>
              <span className="profile-email">{userData.user.email}</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FitnessCenterIcon />
              </div>
              <div className="stat-info">
                <label>Weight</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="edit-input"
                    value={editedData.weight}
                    onChange={(e) => setEditedData({ ...editedData, weight: e.target.value })}
                  />
                ) : (
                  <p>{userData.user.weight} kg</p>
                )}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <BarChartIcon />
              </div>
              <div className="stat-info">
                <label>Height</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="edit-input"
                    value={editedData.height}
                    onChange={(e) => setEditedData({ ...editedData, height: e.target.value })}
                  />
                ) : (
                  <p>{userData.user.height} cm</p>
                )}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <AccessTimeIcon />
              </div>
              <div className="stat-info">
                <label>Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="edit-input"
                    value={editedData.age}
                    onChange={(e) => setEditedData({ ...editedData, age: e.target.value })}
                  />
                ) : (
                  <p>{userData.user.age} years</p>
                )}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FitnessCenterIcon />
              </div>
              <div className="stat-info">
                <label>Activity Level</label>
                {isEditing ? (
                  <select
                    className="edit-input"
                    value={editedData.activityLevel}
                    onChange={(e) => setEditedData({ ...editedData, activityLevel: parseInt(e.target.value) })}
                  >
                    <option value={1}>Sedentary</option>
                    <option value={2}>Light</option>
                    <option value={3}>Moderate</option>
                    <option value={4}>Active</option>
                    <option value={5}>Very Active</option>
                  </select>
                ) : (
                  <p>{getActivityLevelText(userData.user.exercise_info?.active_time || 1)}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="edit-actions">
              <button className="cancel-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="activity-summary">
          <h3>Activity Summary</h3>
          <div className="activity-stats">
            <div className="activity-stat">
              <label>Steps Taken</label>
              <p>{userData.user.exercise_info?.steps || 0}</p>
            </div>
            <div className="activity-stat">
              <label>Calories Burned</label>
              <p>{userData.user.exercise_info?.calories_burned || 0}</p>
            </div>
            <div className="activity-stat">
              <label>Active Minutes</label>
              <p>{userData.user.exercise_info?.active_time || 0} min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;