import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import './my-piano.css'
import { useContext } from 'react';

import SoundfontProvider from '../../providers/soundfont-provider';
import PianoContext from './../../context/piano-context';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
    first: MidiNumbers.fromNote('c3'),
    last: MidiNumbers.fromNote('b5'),
};

const colorNote = (midiNumber, isValid) => {
    document.querySelectorAll('.ReactPiano__Keyboard .ReactPiano__Key')[midiNumber - noteRange.first].classList.add(`${isValid?'green':'red'}-note`);
};

export default function MyPiano() {
    const { notes, setNotes, validity } = useContext(PianoContext);

    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('b5');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.QWERTY_ROW.filter(({ natural }) => natural !== '[').concat(KeyboardShortcuts.BOTTOM_ROW)
    });

    return (
        <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
                <Piano
                    noteRange={noteRange}
                    width={600}
                    playNote={(midiNumber) => {
                        playNote(midiNumber);
                    }}
                    stopNote={(midiNumber) => {
                        const validityValue = validity['scales'](midiNumber);

                        setNotes({
                            ...notes,
                            [midiNumber]: validityValue
                        });
                        stopNote(midiNumber);
                        colorNote(midiNumber, validityValue);
                    }}
                    disabled={isLoading}
                    keyboardShortcuts={keyboardShortcuts}
                />
            )}
        />
    );
}