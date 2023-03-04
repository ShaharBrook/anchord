import { useContext, useEffect, useState } from "react";
import PianoContext from './../../context/piano-context';
import { reset } from '../my-piano/my-piano';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Ab', 'Bb', 'Db', 'Eb', 'Gb'];
const IntervalTypes = ['Minor Second', 'Major Second', 'Minor Third', 'Major Third', 'Perfect Forth', 'Tritone', 'Perfect Fifth', 'Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh'];

export default function Intervals() {

    const { leadingNote, setLeadingNote,
        intervalTypeIndex, setIntervalTypeIndex,
        notes, setNotes,
        setPage } = useContext(PianoContext);

    const [isDone, setIsDone] = useState(false);

    const resetNotes = () => {
        setNotes({});
        reset();
        setLeadingNote(NOTES[Math.floor(Math.random() * NOTES.length)]);
        setIntervalTypeIndex(Math.floor(Math.random() * IntervalTypes.length));
    }

    useEffect(() => {
        resetNotes();
        setPage('intervals');
        console.log('intervals');
    }, []);

    useEffect(() => {
        let uniqueNotes = new Set();
        const normaliziedNotes = Object.entries(notes).filter(([_, validityValue]) => validityValue).map(([midiNumber, _]) => (parseInt(midiNumber) + 12) % 12);
        for (const note of normaliziedNotes) {
            uniqueNotes.add(note);

            if (uniqueNotes.size === 1) {
                setIsDone(true);
                return;
            }
        }

        setIsDone(false);
    }, [notes])

    return <h1>{leadingNote} {IntervalTypes[intervalTypeIndex]}
        {isDone && <button onClick={resetNotes}>reset</button>}
    </h1>
}