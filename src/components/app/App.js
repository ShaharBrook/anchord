import { useState } from 'react';
import MyPiano from '../my-piano/my-piano';
import './App.css';
import PianoContext from './../../context/piano-context';

export default function App() {
  const [ notes, setNotes ] = useState([]);

  return (
    <div className="app">
      <PianoContext.Provider value={{notes, setNotes}}>
        <h1>
         Anchord {notes.join(', ')}
        </h1>
        <MyPiano />
      </PianoContext.Provider>
    </div>
  );
}