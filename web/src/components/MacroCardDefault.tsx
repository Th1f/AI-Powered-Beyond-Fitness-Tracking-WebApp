import { CubeIcon } from "@heroicons/react/24/solid";
import "./MacroCardDefault.css";
import LinearProgress from "@mui/joy/LinearProgress";

interface MacroCardProps {
  protein: number | undefined;
  carbs: number | undefined;
  fat: number | undefined;
}

function handleMacros(macro: number) {
  if (macro > 200) {
    return 200;
  }
  return macro;
}

export default function MacroCardDefault({
  protein,
  carbs,
  fat,
}: MacroCardProps) {
  return (
    <div className="card">
      <div className="card-header" style={{ margin: 0 }}>
        <h2>Macros</h2>
        <CubeIcon />
      </div>
      <div className="card-content macro-default-content">
        <h3>Protein</h3>
        <LinearProgress
          determinate
          value={(handleMacros(protein ?? 0) / 200) * 100}
          thickness={20}
        />
        <h4>{protein ?? 0} g</h4>
        <h3>Carbs</h3>
        <LinearProgress
          determinate
          value={((handleMacros(carbs ?? 0) / 200) * 100)}
          thickness={20}
        />
        <h4>{carbs ?? 0} g</h4>
        <h3>Fat</h3>
        <LinearProgress
          determinate
          value={(handleMacros(fat ?? 0) / 200) * 100}
          thickness={20}
        />
        <h4>{fat ?? 0} g</h4>
      </div>
    </div>
  );
}
