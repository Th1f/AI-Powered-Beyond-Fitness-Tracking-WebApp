
import { useState, useEffect } from "react";
import {
  fetchUserData,
  UserData,
  addFoodItem,
  FoodItem,
} from "../auth/backendAuth";
import Loading from "./Loading";
import MacroCardDefault from "../components/MacroCardDefault";
import FoodHistory from "../components/FoodHistory";
import "./Diet.css";
import CaloriesLeftCardDefault from "../components/CaloriesLeftCardDefault";

const generateRandomArray = (length: number) => {
  return Array.from({ length }, () => Math.random() * 10);
};

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

function Diet() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foodHistory, setFoodHistory] = useState<FoodItem[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchUserData();
        setUserData(data);

        const initialFoodHistory = (data?.user.diet_info?.food_eaten ?? []).map(
          (item) => ({
            id: item.id || generateUniqueId(),
            name: item.name,
            timestamp: item.timestamp,
            calories: item.calories,
            proteins: item.proteins,
            carbs: item.carbs,
            fats: item.fats,
          })
        );
        setFoodHistory(initialFoodHistory);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  async function handleAdd(newFood: FoodItem) {
    try {
      setIsLoading(true);
      const foodItemToAdd: FoodItem = {
        id: newFood.id || generateUniqueId(),
        name: newFood.name,
        timestamp: newFood.timestamp,
        calories: newFood.calories,
        proteins: newFood.proteins,
        carbs: newFood.carbs,
        fats: newFood.fats,
      };

      const updatedUserData = await addFoodItem(foodItemToAdd);

      const updatedFoodHistory = (
        updatedUserData?.user.diet_info?.food_eaten ?? []
      ).map((item) => ({
        id: item.id || generateUniqueId(),
        name: item.name,
        timestamp: item.timestamp,
        calories: item.calories,
        proteins: item.proteins,
        carbs: item.carbs,
        fats: item.fats,
      }));

      setUserData(updatedUserData);
      setFoodHistory(updatedFoodHistory);
    } catch (error) {
      console.error("Failed to add food item:", error);
      
    }
    setIsLoading(false);
  }

  const caloriesLeft = userData?.user.diet_info?.calories_left ?? 2000;
  return isLoading ? (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Loading />
    </div>
  ) : (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-6 text-primary-color">Diet</h1>
      <div className="diet-main-card-container">
        <div className="diet-top-container">
          <CaloriesLeftCardDefault caloriesLeft={caloriesLeft} />
          <MacroCardDefault
            protein={userData?.user.diet_info?.proteins ?? 0}
            carbs={userData?.user.diet_info?.carbs ?? 0}
            fat={userData?.user.diet_info?.fats ?? 0}
          />
        </div>
        <div className="history-container">
          <FoodHistory foodHistory={foodHistory} onAdd={handleAdd} />
        </div>
      </div>
    </div>
  );
}

export default Diet;
