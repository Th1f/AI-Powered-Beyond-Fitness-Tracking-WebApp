import React from "react";
import {
  FireIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

import { ChartContainer } from "@mui/x-charts/ChartContainer";
import {
  LinePlot,
  MarkPlot,
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts/LineChart";
import { useState, useEffect } from 'react';
import { fetchUserData, UserData } from '../auth/backendAuth';
import CaloriesLeftCard from '../components/CaloriesLeftCard';
import MacroCard from '../components/MacroCard';

import Loading from './Loading';
import "./Dashboard.css";

const generateRandomArray = (length: number) => {
  return Array.from({ length }, () => Math.random() * 10);
};

const greetings = [
  "Hello! How's your fitness journey going?",
  "Remember to stay hydrated! 💧",
  "You're doing great! Keep it up! 💪",
  "Time for a quick stretch break? 🧘‍♂️",
  "Your dedication is inspiring! ⭐",
  "Don't forget to log your meals! 🥗",
  "Every step counts towards your goals! 🎯"
];

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentGreeting, setCurrentGreeting] = useState<string>('');
  const [showGreeting, setShowGreeting] = useState(false);

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

  useEffect(() => {
    const showRandomGreeting = () => {
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setCurrentGreeting(randomGreeting);
      setShowGreeting(true);
      
      setTimeout(() => {
        setShowGreeting(false);
      }, 4000);
    };

    const initialTimeout = setTimeout(showRandomGreeting, 2000);

    const interval = setInterval(showRandomGreeting, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  console.log(userData?.user.diet_info);

  const workoutXAxis = generateRandomArray(6);
  const workoutSeries = generateRandomArray(6);

  const caloriesXAxis = generateRandomArray(6);
  const caloriesSeries = generateRandomArray(6);

  const activeMinutesXAxis = generateRandomArray(6);
  const activeMinutesSeries = generateRandomArray(6);

  return (
    isLoading ? (
      <Loading />
    ) : error ? (
      <p>{error}</p>
    ) : (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-6 text-primary-color">Dashboard</h1>
      <div className="main-card-container">
        <div className="card-container top-container">
          <div className="card physical-activity">
            <div className="card-header">
              <h3>Physical Activity</h3>
              <FireIcon className="w-6 h-6 text-orange-500" />
            </div>
            <div className="graph-placeholder">
              <div className="physical-activity-display">
                <div className="activity-block block-1">
                  <ChartContainer
                    width={250}
                    height={300}
                    series={[{ type: "line", data: workoutXAxis }]}
                    xAxis={[{ scaleType: "point", data: workoutSeries }]}
                    sx={{
                      [`& .${lineElementClasses.root}`]: {
                        stroke: "#8884d8",
                        strokeWidth: 2,
                      },
                      [`& .${markElementClasses.root}`]: {
                        stroke: "#8884d8",
                        scale: "0.6",
                        fill: "#fff",
                        strokeWidth: 2,
                      },
                    }}
                    disableAxisListener
                  >
                    <LinePlot />
                    <MarkPlot />
                  </ChartContainer>
                  <h4>Steps Taken</h4>
                  <span className="block-value">{userData?.user?.exercise_info?.steps}</span>
                </div>
                <div className="activity-block block-2">
                  <ChartContainer
                    width={250}
                    height={250}
                    series={[{ type: "line", data: caloriesXAxis }]}
                    xAxis={[{ scaleType: "point", data: caloriesSeries }]}
                    sx={{
                      [`& .${lineElementClasses.root}`]: {
                        stroke: "#8884d8",
                        strokeWidth: 2,
                      },
                      [`& .${markElementClasses.root}`]: {
                        stroke: "#8884d8",
                        scale: "0.6",
                        fill: "#fff",
                        strokeWidth: 2,
                      },
                    }}
                    disableAxisListener
                  >
                    <LinePlot />
                    <MarkPlot />
                  </ChartContainer>
                  <h4>Calories Burned</h4>
                  <span className="block-value">{userData?.user?.exercise_info?.calories_burned}</span>
                </div>
                <div className="activity-block block-3">
                  <ChartContainer
                    width={250}
                    height={250}
                    series={[{ type: "line", data: activeMinutesXAxis }]}
                    xAxis={[{ scaleType: "point", data: activeMinutesSeries }]}
                    sx={{
                      [`& .${lineElementClasses.root}`]: {
                        stroke: "#8884d8",
                        strokeWidth: 2,
                      },
                      [`& .${markElementClasses.root}`]: {
                        stroke: "#8884d8",
                        scale: "0.6",
                        fill: "#fff",
                        strokeWidth: 2,
                      },
                    }}
                    disableAxisListener
                  >
                    <LinePlot />
                    <MarkPlot />
                  </ChartContainer>
                  <h4>Active Minutes</h4>
                  <span className="block-value">{userData?.user?.exercise_info?.active_time}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card calendar">
            <div className="card-header">
              <h3>Sprite</h3>
              <FireIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div className="graph-placeholder">
              <div className="sprite-container">
                <div className={`speech-bubble ${showGreeting ? 'show' : ''}`}>
                  {currentGreeting}
                </div>
                <div className="sprite">
                  <div className="sprite-eye left"></div>
                  <div className="sprite-eye right"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-container bot-container">
          {/* Workout Summary Card */}
          <div className="card-container bot">
           <CaloriesLeftCard caloriesLeft={userData?.user?.diet_info?.calories_left}/>
            <div className="card" style={{ margin: "0rem" }}>
              <MacroCard proteins={userData?.user?.diet_info?.proteins} carbs={userData?.user?.diet_info?.carbs} fats={userData?.user?.diet_info?.fats} />
            </div>
          </div>
          <div className="card-container bot-right">
            <div className="card card-bot-right">
              <div className="card-header">
                <h3>Upcoming Schedule</h3>
                <FireIcon />
              </div>
              <div className="card-content">
                <p>Track your fitness progress and stay motivated.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default Dashboard;
