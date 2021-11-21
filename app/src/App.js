import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import TasksOverview from './TasksOverview';
import TaskSubmit from './TaskSubmit';
import UserPerformanceOverview from './UserPerformanceOverview';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TasksOverview />} />
        <Route path="/:id" element={<TaskSubmit />} />
        <Route path="/overview" element={<UserPerformanceOverview />} />
      </Routes>
    </div>
  );
}

export default App;
