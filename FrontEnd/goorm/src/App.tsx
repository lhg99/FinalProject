import React from 'react';
import Header from './components/Header/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat/components/Chat'
import FloatingButtonWithChat from './pages/Chat/components/FloatingButtonWithChat';
import Exercise from './pages/Exercise/Exercise';
import Map from './pages/FindGym/Map/Map';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <main>
          <Routes>
              <Route path="/" element={<h1>Welcome to MyWebsite</h1>} />
              <Route path="/Chat" element={<Chat />} />
              <Route path='/exercise' element={<Exercise />}/>
              <Route path='/findgym' element={<Map />} />
            </Routes>
        </main>
        <FloatingButtonWithChat/>
      </div>
    </BrowserRouter>
  );
};

export default App;