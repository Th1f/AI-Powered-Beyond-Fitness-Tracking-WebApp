import React, { useState, useEffect } from 'react';
import { fetchUserData, UserData } from '../auth/backendAuth';
import Loading from '../routes/Loading';

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);  
        const data = await fetchUserData();
        console.log("data fetched");
        setUserData(data);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);


  return (
    <div className="profile-page">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <h1>User Profile</h1>
          <div className="profile-details">
            <img src="/path-to-avatar" alt="Profile" />
            <div className="user-info">
              <h2>{userData?.user.username}</h2>
              <p>Age: {userData?.user.age}</p>
              <p>Weight: {userData?.user.weight} kg</p>
              <p>Height: {userData?.user.height} cm</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;