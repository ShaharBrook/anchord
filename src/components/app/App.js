import { useState } from 'react';
import { MidiNumbers } from 'react-piano';

import MyPiano from '../my-piano/my-piano';
import './App.css';
import PianoContext from './../../context/piano-context';
import MyRoutes, { defaultRoute } from '../routes/routes';

export default function App() {
  const [leadingNote, setLeadingNote] = useState('');
  const [scaleType, setScaleType] = useState({});
  const [intervalTypeIndex, setIntervalTypeIndex] = useState(0);
  const [notes, setNotes] = useState({});
  const [page, setPage] = useState(defaultRoute);

  const validity = {
    scales: function (midiNumber) {
      const relativeDistance = (midiNumber - MidiNumbers.fromNote(leadingNote + '1')) % 12;
      return scaleType['formula'].includes(relativeDistance);
    },
    intervals: function (midiNumber) {
      const relativeDistance = (midiNumber - MidiNumbers.fromNote(leadingNote + '1')) % 12;
      return relativeDistance === intervalTypeIndex + 1;
    },
    chords: function (midiNumber) {
      return true;
    }
  };

  return (
    <div className="app">
      <PianoContext.Provider value={{
        notes, setNotes, validity,
        leadingNote, setLeadingNote,
        scaleType, setScaleType,
        intervalTypeIndex, setIntervalTypeIndex,
        page, setPage
      }}>
        <h1>
          Anchord
        </h1>
        <MyRoutes />
        <MyPiano />
      </PianoContext.Provider>
    </div>
  );
}