import React, { useEffect, useState } from "react";
import TodayExcercise from "../components/TodayExcercise";
import "./Workout.css";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import { fetchUserData, workoutInfo, TodayExcercise as TodayExcerciseType } from "../auth/backendAuth";
import { fetchUserWorkoutData } from "../auth/backendAuth";
import Loading from "./Loading";

export default function Workout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<workoutInfo>();
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchUserWorkoutData();
        const respondData: workoutInfo = {
          active_time: data.active_time,
          calories_burned: data.calories_burned,
          schedule: data.schedule,
          steps: data.steps,
          todays_exercise: data.todays_exercise
        };
        setUserData(respondData);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><Loading /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData || !userData.todays_exercise) {
    return <div>No workout data available</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-6 text-primary-color">Workout</h1>
      <div className="workout-content-container">
        <div className="workout-top-content-container">
          <TodayExcercise todayExcercise={userData.todays_exercise} />
        </div>
        {/* <div className="workout-bottom-content-container">
          <div className="card">
            <div className="calendar-icon">
              <CalendarIcon />
            </div>
            <div className="calendar-container">
              <CalendarComponent />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
