import React from "react";
import TodayExcercise from "../components/TodayExcercise";
import "./Workout.css";
import CalendarComponent from "../components/Calendar";
import { CalendarIcon } from "@mui/x-date-pickers/icons";

export default function Workout() {
  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-6 text-primary-color">Workout</h1>
      <div className="workout-content-container">
        <div className="workout-top-content-container">
          <TodayExcercise />
        </div>
        <div className="workout-bottom-content-container">
          <div className="card">
            <div className="card-header">
              <h3>Workout Calendar</h3>
              <CalendarIcon />
            </div>
            <div className="calendar-container">
            <CalendarComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
