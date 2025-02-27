import React from "react";
import "./FoodHistory.css";

import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { FoodItem } from "../auth/backendAuth";

interface FoodHistoryItem {
  id: string;
  name: string;
  timestamp: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

interface FoodHistoryProps {
  foodHistory: FoodItem[];
  onAdd?: (newFood: FoodItem) => void; 
}

function FoodHistory({ foodHistory, onAdd }: FoodHistoryProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [foodName, setFoodName] = React.useState<string>('');
  const [calories, setCalories] = React.useState<number>(0);
  const [protein, setProtein] = React.useState<number>(0);
  const [carbs, setCarbs] = React.useState<number>(0);
  const [fat, setFat] = React.useState<number>(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newFood: FoodHistoryItem = {
      id: Date.now().toString(), 
      name: foodName,
      calories: calories,
      proteins: protein,
      carbs: carbs,
      fats: fat,
      timestamp: Date.now()
    }
    setOpen(false);
    console.log(newFood);
    if (onAdd) {
      onAdd(newFood);
    }
  };

  return (
    <div className="card food-history-container">
      <div className="food-history-header">
        <h2>Food History</h2>
      </div>
      <div className="food-history-list">
        {foodHistory.length === 0 ? (
          <p className="no-history">You should go eat something!</p>
        ) : (
          foodHistory.map((item) => (
            <div key={item.id} className="card food-history-item">
              <div className="food-item-details">
                <span className="food-item-name">{item.name}</span>
                <span className="food-item-timestamp">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="food-item-macros">
                <span>Cal: {item.calories}</span>
                <span>P: {item.proteins}g</span>
                <span>C: {item.carbs}g</span>
                <span>F: {item.fats}g</span>
              </div>
            </div>
          ))
        )}
      </div>
      {true && (
        <div className="food-history-actions">
          <button className="add-food-btn" onClick={() => setOpen(true)}>
            Add Food
          </button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
              <DialogTitle>Add new food</DialogTitle>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel>Food Name</FormLabel>
                    <Input 
                      autoFocus 
                      required 
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Calories</FormLabel>
                    <Input 
                      type="number" 
                      required 
                      value={calories}
                      onChange={(e) => setCalories(Number(e.target.value))}
                      slotProps={{ 
                        input: { 
                          min: 0, 
                          step: 1 
                        } 
                      }} 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Proteins (g)</FormLabel>
                    <Input 
                      type="number" 
                      required 
                      value={protein}
                      onChange={(e) => setProtein(Number(e.target.value))}
                      slotProps={{ 
                        input: { 
                          min: 0, 
                          step: 0.1 
                        } 
                      }} 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Carbs (g)</FormLabel>
                    <Input 
                      type="number" 
                      required 
                      value={carbs}
                      onChange={(e) => setCarbs(Number(e.target.value))}
                      slotProps={{ 
                        input: { 
                          min: 0, 
                          step: 0.1 
                        } 
                      }} 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Fats (g)</FormLabel>
                    <Input 
                      type="number" 
                      required 
                      value={fat}
                      onChange={(e) => setFat(Number(e.target.value))}
                      slotProps={{ 
                        input: { 
                          min: 0, 
                          step: 0.1 
                        } 
                      }} 
                    />
                  </FormControl>
                  <Button type="submit">Submit</Button>
                </Stack>
              </form>
            </ModalDialog>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default FoodHistory;
