import { useState } from 'react';
import { MidiNumbers } from 'react-piano';

import MyPiano from '../my-piano/my-piano';
import './App.css';
import PianoContext from './../../context/piano-context';
import MyRoutes, { defaultRoute } from '../routes/routes';

export default function App() {
  const [leadingNote, setLeadingNote] = useState('');

  const [autoProceeding, setAutoProceeding] = useState(true);

  const [scaleType, setScaleType] = useState({});

  const [chordType, setChordType] = useState({});
  const [triadTypes, setTriadTypes] = useState({});
  const [seventhTypes, setSeventhTypes] = useState({});
  const [ninthTypes, setNinthTypes] = useState({});
  const [eleventhTypes, setEleventhTypes] = useState({});
  const [thirteenthTypes, setThirteenthTypes] = useState({});

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
      const relativeDistance = (midiNumber - MidiNumbers.fromNote(leadingNote + '1')) % 12;
      return chordType['intervals'].includes(relativeDistance);
    }
  };

  return (
    <div className="app">
      <PianoContext.Provider value={{
        leadingNote, setLeadingNote,

        autoProceeding, setAutoProceeding,

        scaleType, setScaleType,

        chordType, setChordType,
        triadTypes, setTriadTypes,
        seventhTypes, setSeventhTypes,
        ninthTypes, setNinthTypes,
        eleventhTypes, setEleventhTypes,
        thirteenthTypes, setThirteenthTypes,

        intervalTypeIndex, setIntervalTypeIndex,

        notes, setNotes, validity,
        page, setPage
      }}>
        <h1>
          Anchord
        </h1>
        <div className='main-menu'>
          <button 
            onClick={() => {setAutoProceeding(!autoProceeding)}}
            className={autoProceeding ? 'selected' : 'not-selected'}
          >auto proceed</button>
        </div>
        <MyRoutes />
        <MyPiano />
      </PianoContext.Provider>
    </div>
  );
}