import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Exercise from './pages/Exercise/Exercise';
import Map from './pages/FindGym/Map/Map';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/exercise' element={<Exercise />}></Route>
        <Route path='/map' element={<Map />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
