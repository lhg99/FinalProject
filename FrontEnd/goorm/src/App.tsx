import React from 'react';
import Header from './components/Header/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat/components/Chat'
import FloatingButtonWithChat from './pages/Chat/components/FloatingButtonWithChat';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <main>
          <Routes>
              <Route path="/" element={<h1>Welcome to MyWebsite</h1>} />
              <Route path="/Chat" element={<Chat />} />
            </Routes>
        </main>
        <FloatingButtonWithChat/>
      </div>
    </BrowserRouter>
  );
};

export default App;