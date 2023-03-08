import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import './my-piano.css'
import { useContext, useEffect } from 'react';

import SoundfontProvider from '../../providers/soundfont-provider';
import PianoContext from './../../context/piano-context';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
    first: MidiNumbers.fromNote('c3'),
    last: MidiNumbers.fromNote('b5'),
};

const colorNote = (midiNumber, isValid) => {
    document.querySelectorAll('.ReactPiano__Keyboard .ReactPiano__Key')[midiNumber - noteRange.first].classList.add(`${isValid ? 'green' : 'red'}-note`);
};

export const reset = () => {
    document.querySelectorAll('.ReactPiano__Keyboard .ReactPiano__Key').forEach(element => {
        element.classList.remove(`green-note`);
        element.classList.remove(`red-note`);
    });

}

export default function MyPiano() {
    const { notes, setNotes, validity, page } = useContext(PianoContext);

    const playNoteRef = (midiNumber) => {
        // playNote(midiNumber);
        const validityValue = validity[page](midiNumber);

        setNotes({
            ...notes,
            [midiNumber]: validityValue
        });
        colorNote(midiNumber, validityValue);

    };

    const stopNoteRef = (midiNumber) => {
        const validityValue = validity[page](midiNumber);
        colorNote(midiNumber, validityValue);

        // stopNote(midiNumber);
    };

    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('b5');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.QWERTY_ROW.filter(({ natural }) => natural !== '[').concat(KeyboardShortcuts.BOTTOM_ROW)
    });

    useEffect(() => {
        navigator.requestMIDIAccess().then((midiAccess) => {

            const { inputs } = midiAccess;

            console.log(inputs);
            console.log(inputs[0]);
            console.log(inputs[1]);

            inputs.forEach((input) => {
                input.addEventListener('midimessage', ({ data }) => {
                    const [command, note, velocity] = data;
                    console.log({ command, note, velocity });
                    playNoteRef('' + note);
                })
            });
        });
    }, []);

    return (
        <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
                <Piano
                    noteRange={noteRange}
                    width={600}
                    playNote={playNoteRef}
                    stopNote={stopNoteRef}
                    disabled={isLoading}
                    keyboardShortcuts={keyboardShortcuts}
                />
            )}
        />
    );
}