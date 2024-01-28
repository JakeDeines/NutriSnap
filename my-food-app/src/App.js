// App.js
import React from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload'; // This is now the wrapped component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>NutriSnap</h1>
        <ImageUpload /> {/* Now wrapped with cell phone frame styling */}
      </header>
    </div>
  );
}

export default App;
