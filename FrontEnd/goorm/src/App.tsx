import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';



function App() {
  const handleClick = async () => {
    try {
      const response = await axios.post('http://final-project-app-env.eba-xdjqmujd.ap-northeast-2.elasticbeanstalk.com/api/con_test', {
        sender: 'sender'
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={handleClick}>Send POST Request</button>
      </header>
    </div>
  );
}

export default App;
