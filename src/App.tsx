import React from 'react';
import './App.css';
import Flashcard from './components/Flashcard';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Flashcard />
      </header>
    </div>
  );
};

export default App;
