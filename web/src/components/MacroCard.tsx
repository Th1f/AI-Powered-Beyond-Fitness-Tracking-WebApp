import { CubeIcon } from "@heroicons/react/24/solid";
import CircularProgress from '@mui/joy/CircularProgress';
import "./MacroCard.css";

interface MacroCardProps {
  proteins: number | undefined;
  carbs: number | undefined;
  fats: number | undefined;
}

function handleMacros(macro:number){
if(macro > 200){
    return 200;
  }
  return macro;
}



export default function MacroCardDashboard({ proteins, carbs, fats }: MacroCardProps) {
    console.log(proteins , carbs , fats);
    return (
    <>
      <div className="card-header" style={{margin:0}}>
        <h2>Macros</h2>
        <CubeIcon />
      </div>
      <div className="card-content macro-content">
        <h3>Protein</h3>
        <CircularProgress determinate value={(handleMacros(proteins ?? 0)/200)*100} />
        <h4>{proteins} g</h4>
        <h3>Carbs</h3>
        <CircularProgress determinate value={(handleMacros(carbs ?? 0)/200)*100} />
        <h4>{carbs} g</h4>
        <h3>Fat</h3>
        <CircularProgress determinate value={(handleMacros(fats ?? 0)/200)*100} />
        <h4>{fats} g</h4>
      </div>
      </>
  );
}