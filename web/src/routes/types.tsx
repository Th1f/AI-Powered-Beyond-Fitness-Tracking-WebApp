export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Workout {
  id: number;
  name: string;
  exercises: Exercise[];
  date: Date;
  duration: number; // in minutes
}