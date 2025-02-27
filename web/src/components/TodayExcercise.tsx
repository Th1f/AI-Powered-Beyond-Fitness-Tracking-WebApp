import  { useState, useEffect } from "react";
import { FireIcon,} from "@heroicons/react/24/solid";
import "./TodayExcercise.css";


interface Exercise {
  name: string;
  sets: number;
  reps: string;
  id: string;
}

interface WorkoutType {
  name: string;
  description: string;
  exercises: Exercise[];
  caloriesBurned: number;
}

const exerciseTypes: WorkoutType[] = [
  {
    name: "Push Day",
    description: "Chest, Shoulders, Triceps",
    caloriesBurned: 450,
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-12", id: "push-1" },
      { name: "Overhead Press", sets: 3, reps: "10-12", id: "push-2" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "12-15", id: "push-3" },
      { name: "Lateral Raises", sets: 3, reps: "12-15", id: "push-4" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", id: "push-5" },
      { name: "Diamond Push-ups", sets: 3, reps: "Till failure", id: "push-6" },
    ],
  },
  {
    name: "Pull Day",
    description: "Back, Biceps",
    caloriesBurned: 400,
    exercises: [
      { name: "Pull-ups/Lat Pulldowns", sets: 4, reps: "8-12", id: "pull-1" },
      { name: "Barbell Rows", sets: 3, reps: "10-12", id: "pull-2" },
      { name: "Face Pulls", sets: 3, reps: "12-15", id: "pull-3" },
      { name: "Bicep Curls", sets: 3, reps: "12-15", id: "pull-4" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", id: "pull-5" },
      { name: "Reverse Flyes", sets: 3, reps: "15-20", id: "pull-6" },
    ],
  },
  {
    name: "Leg Day",
    description: "Quadriceps, Hamstrings, Calves",
    caloriesBurned: 550,
    exercises: [
      { name: "Squats", sets: 4, reps: "8-12", id: "leg-1" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12", id: "leg-2" },
      { name: "Leg Press", sets: 3, reps: "12-15", id: "leg-3" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg", id: "leg-4" },
      { name: "Leg Extensions", sets: 3, reps: "15-20", id: "leg-5" },
      { name: "Calf Raises", sets: 4, reps: "15-20", id: "leg-6" },
    ],
  },
  {
    name: "Core Day",
    description: "Abs, Lower Back",
    caloriesBurned: 300,
    exercises: [
      { name: "Planks", sets: 3, reps: "45-60 sec", id: "core-1" },
      { name: "Russian Twists", sets: 3, reps: "20 each side", id: "core-2" },
      { name: "Leg Raises", sets: 3, reps: "12-15", id: "core-3" },
      { name: "Back Extensions", sets: 3, reps: "12-15", id: "core-4" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", id: "core-5" },
      { name: "Dead Bug", sets: 3, reps: "10 each side", id: "core-6" },
    ],
  },
  {
    name: "Rest Day",
    description: "Recovery and Stretching",
    caloriesBurned: 150,
    exercises: [
      { name: "Light Walking", sets: 1, reps: "20-30 min", id: "rest-1" },
      { name: "Dynamic Stretching", sets: 1, reps: "10-15 min", id: "rest-2" },
      { name: "Foam Rolling", sets: 1, reps: "10-15 min", id: "rest-3" },
      { name: "Yoga/Mobility Work", sets: 1, reps: "15-20 min", id: "rest-4" },
    ],
  },
];

function getTodoList(date: any) {
  if (!date) {
    return [];
  }
  const day = date.getDate();

  switch (day) {
    case 10:
      return [
        { time: "10:30 am", title: "Meeting" },
        { time: "12:00 pm", title: "Lunch" },
      ];
    case 15:
      return [
        { time: "09:30 pm", title: "Products Introduction Meeting" },
        { time: "12:30 pm", title: "Client entertaining" },
        { time: "02:00 pm", title: "Product design discussion" },
        { time: "05:00 pm", title: "Product test and acceptance" },
        { time: "06:30 pm", title: "Reporting" },
      ];
    default:
      return [];
  }
}

export default function TodayExcercise() {
  const [currentExercise, setCurrentExercise] = useState(exerciseTypes[0]);
  const [todayDate, setTodayDate] = useState("");
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    setTodayDate(today.toLocaleDateString("en-US", options));

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setCurrentExercise(exerciseTypes[4]); 
    } else {
      setCurrentExercise(exerciseTypes[(dayOfWeek - 1) % 4]);
    }
  }, []);

  useEffect(() => {
    const progressPercentage =
      (completedExercises.size / currentExercise.exercises.length) * 100;
    setProgress(progressPercentage);
  }, [completedExercises, currentExercise.exercises.length]);

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

  return (
    <div className="card exercise-card">
      <div className="exercise-card-header">
        <h2>Today's Exercise</h2>
        <span className="today-date">{todayDate}</span>
      </div>

      <div className="exercise-card-content">
        <div className="workout-left-container">
          <div className="exercise-type">
            <h3>{currentExercise.name}</h3>
            <p>{currentExercise.description}</p>
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
              {currentExercise.exercises.map((exercise) => (
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
                  {currentExercise.caloriesBurned}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
