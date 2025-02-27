import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, fetchUserProfile } from "../auth/backendAuth";
import "./ProfileSetup.css";
import Loading from "../routes/Loading";

const ProfileSetup: React.FC = () => {
  const [age, setAge] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [weight, setWeight] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

 
  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const userProfile = await fetchUserProfile();

        if (userProfile.age && userProfile.height && userProfile.weight) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.log("Profile not yet set up");
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !height || !weight) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await updateUserProfile({
        age,
        height,
        weight,
      });

      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="profile-setup-container">
      <form onSubmit={handleSubmit} className="profile-setup-form">
        <h2>Complete Your Profile</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={age || ""}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="Enter your age"
            min="13"
            max="120"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            value={height || ""}
            onChange={(e) => setHeight(Number(e.target.value))}
            placeholder="Enter your height in cm"
            min="50"
            max="300"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight || ""}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="Enter your weight in kg"
            min="20"
            max="500"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Complete Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
