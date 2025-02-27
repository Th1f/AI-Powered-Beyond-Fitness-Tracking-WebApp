import { useState, useEffect } from "react";
import { FireIcon } from "@heroicons/react/24/solid";
import type { TodayExcercise as TodayExcerciseType } from "../auth/backendAuth";
import "./TodayExcercise.css";

import { completeTodaysWorkout, exerciseInfo } from "../auth/backendAuth";


interface Props {
  todayExcercise: TodayExcerciseType;
}

export default function TodayExcercise({ todayExcercise }: Props) {
  const exercises: exerciseInfo[] = todayExcercise.exercises;
  const [todayDate, setTodayDate] = useState("");
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);
  const [showCompletionButton, setShowCompletionButton] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setTodayDate(today.toLocaleDateString("en-US", options));
  }, []);

  useEffect(() => {
    const progressPercentage =
      (completedExercises.size / exercises.length) * 100;
    setProgress(progressPercentage);
    setShowCompletionButton(progressPercentage === 100);
  }, [completedExercises, exercises.length]);

  const toggleExerciseCompletion = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(exerciseId)) {
        newCompleted.delete(exerciseId);
      } else {
        newCompleted.add(exerciseId);
      }
      return newCompleted;
    });
  };

  const handleWorkoutCompletion = async () => {
    try {
      await completeTodaysWorkout();
      window.location.reload();
    } catch (error) {
      console.error("Error completing workout:", error);
    }
  };

  return (
    <div className="card exercise-card">
      <div className="exercise-card-header">
        <h2>Today's Exercise</h2>
        <span className="today-date">{todayDate}</span>
      </div>

      <div className="exercise-card-content">
        {exercises.length === 0 ? (
          <div className="no-exercises-container">
            <h3>No Workout Plan Yet!</h3>
            <p>Ask Sprite to create a personalized workout plan for you.</p>
            <p>Just click the chat icon in the bottom right corner and say "Create a workout plan for me"!</p>
          </div>
        ) : (
          <div className="workout-left-container">
            <div className="exercise-type">
              <h3>{exercises[0].exercises_type}</h3>
              <p>{exercises[0].desc}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
                <span className="progress-text">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>
            <div className="exercise-info">
              <div className="exercises-list">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    className={`exercise-item ${
                      completedExercises.has(exercise.id) ? "completed" : ""
                    }`}
                    onClick={() => toggleExerciseCompletion(exercise.id)}
                    aria-label={`${exercise.name} - ${
                      completedExercises.has(exercise.id)
                        ? "Mark as incomplete"
                        : "Mark as complete"
                    }`}
                  >
                    <div className="exercise-name">{exercise.name}</div>
                    <div className="exercise-right">
                      <div className="exercise-details">
                        <span className="sets">{exercise.sets} sets</span>
                        <span className="reps">{exercise.reps}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="calories-summary">
                <div className="calories-icon">
                  <FireIcon className="h-6 w-6" />
                </div>
                <div className="calories-text">
                  <span className="calories-label">
                    Estimated Calories Burned
                  </span>
                  <span className="calories-value">
                    {exercises.reduce((total, ex) => total + (ex.calorie || 0), 0)}
                  </span>
                </div>
              </div>
              {showCompletionButton && (
                <button
                  className="complete-workout-button"
                  onClick={handleWorkoutCompletion}
                  aria-label="Complete today's workout"
                >
                  Complete Workout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
