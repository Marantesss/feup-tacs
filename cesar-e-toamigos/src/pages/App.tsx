import React from 'react';
import Editor from '../components/Editor';
import Viewer from '../components/Viewer';
import './App.css';

const App = () => {
  return (
    <div className="min-h-full w-full">
      <div className='grid grid-cols-2 gap-2'>
        <Editor />
        <Viewer />
      </div>
    </div>
  );
}

export default App;
