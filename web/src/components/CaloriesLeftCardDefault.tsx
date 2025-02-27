import { FireIcon, CalendarIcon } from "@heroicons/react/24/solid";
import CircularProgress from '@mui/joy/CircularProgress';
import "./CaloriesLeftCardDefault.css";

export default function CaloriesLeftCardDefault({ caloriesLeft }: any) {
    if (caloriesLeft < 0) {
        caloriesLeft = 0;
      }
    return (
    <div className="card card-bot">
      <div className="card-header" style={{margin:0}}>
        <h2>Calories Left</h2>
        <FireIcon />
      </div>
      <div className="card-content calories-left-default-content">
        <CircularProgress determinate value={((caloriesLeft ?? 0)/2000)*100} sx={{ '--CircularProgress-size': '25vh' }} />
        <h2>{caloriesLeft} kCal </h2>
      </div>
    </div>
  );
}
