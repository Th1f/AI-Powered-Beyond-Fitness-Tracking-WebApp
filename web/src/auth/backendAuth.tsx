import { auth } from "../config/firebase";

const BACKEND_URL = ""

export interface workoutInfo{
  active_time: number;
  calories_burned: number;
  schedule:[];
  steps: number;
  todays_exercise:TodayExcercise;
}

export interface workoutRequestInfo{
  split: string;
  split_rotation: string[];
}

export interface TodayExcercise{
  exercises: [exerciseInfo];
}

export interface exerciseInfo{
  calorie: number;
  exercises_type: string;
  id: string;
  name: string;
  reps: string;
  sets: number; 
  desc: string;
}


export interface addFoodDescription{
  food_calories: number;
  food_carbs: number;
  food_fats: number;
  food_name: string;
  food_proteins: number;
}

interface DietInfo {
  goal: string;
  calories_goal: number;
  carbs: number;
  proteins: number;
  fats: number;
  calories_left: number;
  food_eaten: FoodItem[];
}

export interface AImessage{
  message: string;
}

export interface FoodItem {
  id?: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  timestamp: number;
}

interface ExerciseInfo {
  steps: number;
  calories_burned: number;
  active_time: number;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  age?: number;
  height?: number;
  weight?: number;
  exercise?: string;
  diet_info?: DietInfo;
  exercise_info?: ExerciseInfo;
}

interface Workout {
  id?: string;
  [key: string]: any;
}

export interface UserData {
  user: {
    id: string;
    email: string;
    username: string;
    age?: number;
    height?: number;
    weight?: number;
    exercise?: string;
    diet_info?: DietInfo;
    exercise_info?: ExerciseInfo;
  };
  workouts: Workout[];
}

export const verifyTokenWithBackend = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      throw new Error("No user logged in");
    }

    console.log("Attempting to get ID token...");
    const token = await user.getIdToken();
    console.log("Token obtained:", token ? "Yes" : "No");

    if (!token) {
      console.error("Failed to obtain ID token");
      throw new Error("Failed to obtain ID token");
    }

    console.log("Sending token to backend verification...");
    const response = await fetch(`${BACKEND_URL}/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token }),
    });

    console.log("Backend response received");
    const result = await response.json();

    console.log("Backend verification result:", result);

    return result;
  } catch (error) {
    console.error("Backend token verification failed", error);
    throw error;
  }
};

export const createUserInBackend = async (username: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    if (!user.email) {
      throw new Error("User email is required");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        username: username,
      }),
    });

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Failed to create user");
    }

    return result;
  } catch (error) {
    console.error("Error creating user in backend:", error);
    throw error;
  }
};

export const updateUserProfile = async (updateData: {
  age?: number;
  height?: number;
  weight?: number;
  exercise?: string;
  diet_info?: DietInfo;
  exercise_info?: ExerciseInfo;
}) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/update-user-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Failed to update user profile");
    }

    return result;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};


export const fetchDetailedUserProfile = async (): Promise<UserProfile> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/get-user-profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Failed to fetch user profile");
    }

    return result.user;
  } catch (error) {
    console.error("Error fetching detailed user profile:", error);
    throw error;
  }
};

export const completeTodaysWorkout = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user logged in");
        }

        const token = await user.getIdToken();

        const response = await fetch(`${BACKEND_URL}/todays-exercise-completion`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
            throw new Error(result.message || "Failed to complete today's workout");
        }

        return result;
    } catch (error) {
        console.error("Error completing today's workout:", error);
        throw error;
    }
}


export const generateWorkoutPlan = async (workoutData: workoutRequestInfo): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/generate-workout-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ workout: workoutData }),
    });

    const result = await response.json()
    return result;
  } catch (error) {
    console.error("Error adding workout:", error);
    throw error;
  }
};


export const fetchWorkouts = async (): Promise<Workout[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/get-workouts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Failed to fetch workouts");
    }

    return result.workouts;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
  }
};


export const fetchUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/user-profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Failed to fetch user profile");
    }

    return result.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};


export const fetchProtectedData = async (endpoint: string) => {
  try {

    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {

        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error("Failed to fetch protected data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching protected data:", error);
    throw error;
  }
};


export const fetchUserData = async (): Promise<UserData> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/user-data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Failed to fetch user data");
    }

    return result;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchUserWorkoutData = async (): Promise<workoutInfo> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${BACKEND_URL}/get-workouts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status !== "success") {
      throw new Error(result.message || "Failed to fetch user data");
    }
    return result;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const SendAImessage = async (message : AImessage) =>{
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();
    if (!token) {
      throw new Error("Failed to obtain ID token");
    }

    const response = await fetch(`${BACKEND_URL}/send-ai-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(message),
    });

    const result = await response.json();
    return result
    
  } catch (error) {
    console.error("Error sending AI message:", error);
    throw error;
  }
}
export const addFoodItem = async (foodItem: FoodItem): Promise<UserData> => {
  try {
    // Get current user's ID token
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      throw new Error("No user logged in");
    }

    const token = await user.getIdToken();
    if (!token) {
      console.error("Failed to obtain ID token");
      throw new Error("Failed to obtain ID token");
    }
    const response = await fetch(`${BACKEND_URL}/add-food-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(foodItem),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add food item: ${errorText}`);
    }
    const updatedUserData: UserData = await response.json();
    return updatedUserData;
  } catch (error) {
    console.error("Error adding food item:", error);
    throw error;
  }
};
