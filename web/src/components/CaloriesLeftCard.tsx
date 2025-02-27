import { FireIcon } from "@heroicons/react/24/solid";
import CircularProgress from "@mui/joy/CircularProgress";
import "./CaloriesLeftCard.css";

export default function CaloriesLeftCardDashboard({ caloriesLeft }: any) {
  if (caloriesLeft < 0) {
    caloriesLeft = 0;
  }
  return (
    <div className="card card-bot">
      <div className="card-header" style={{ margin: 0 }}>
        <h2>Calories Left</h2>
        <FireIcon />
      </div>
      <div className="card-content calories-left-content">
        <CircularProgress
          determinate
          value={((caloriesLeft ?? 0) / 2000) * 100}
        />
        <h3>{caloriesLeft} kCal </h3>
      </div>
    </div>
  );
}
