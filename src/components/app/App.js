import { useState } from 'react';
import { MidiNumbers } from 'react-piano';

import MyPiano from '../my-piano/my-piano';
import './App.css';
import PianoContext from './../../context/piano-context';

import { RouterProvider } from "react-router-dom";
import { router } from './../routes/routes';
import Navbar from './../navbar/navbar';

export default function App() {
  const [leadingNote, setLeadingNote] = useState('');
  const [scaleType, setScaleType] = useState({});

  const [notes, setNotes] = useState({});
  const validity = {
    scales: function (midiNumber) {
      // TODO: 
      const relativeDistance = (midiNumber - MidiNumbers.fromNote(leadingNote + '1')) % 12;
      return scaleType['formula'] .includes(relativeDistance);
    }
  };

  return (
    <div className="app">
      <PianoContext.Provider value={{ notes, setNotes, validity, 
      leadingNote, setLeadingNote,
      scaleType, setScaleType }}>
        <h1>
          Anchord
        </h1>
        <Navbar />
        <RouterProvider router={router} />
        <MyPiano />
      </PianoContext.Provider>
    </div>
  );
}