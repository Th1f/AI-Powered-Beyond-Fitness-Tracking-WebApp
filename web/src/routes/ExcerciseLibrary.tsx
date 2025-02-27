import React, { useState } from 'react';
import { Exercise } from './types';

const ExerciseLibrary: React.FC = () => {
  const [exercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState('');

  return (
    <div className="exercise-library">
      <h1>Exercise Library</h1>
      <input 
        type="text" 
        placeholder="Search exercises..." 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="exercise-grid">
        {exercises
          .filter(ex => ex.name.toLowerCase().includes(filter.toLowerCase()))
          .map(exercise => (
            <div key={exercise.id} className="exercise-card">
              <h3>{exercise.name}</h3>
              <p>{exercise.muscleGroup}</p>
              <p>{exercise.difficulty}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;