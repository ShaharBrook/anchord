import { useContext, useEffect, useState } from 'react';
import PianoContext from './../../context/piano-context';
import { reset } from '../my-piano/my-piano';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Ab', 'Bb', 'Db', 'Eb', 'Gb'];

export const scaleModifications = (baseScale, modifications) => {
    const newScale = baseScale.slice(0);
    modifications.forEach(([index, diff]) => {
        newScale[index - 1] += diff;
    })
    return newScale;
}

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = scaleModifications(MAJOR_SCALE, [[3, -1], [6, -1], [7, -1]]);
const ScaleTypes = [{
    text: 'Ionian',
    formula: MAJOR_SCALE
},
{
    text: 'Dorian',
    formula: scaleModifications(MINOR_SCALE, [[6, 1]])
},
{
    text: 'Phrygian',
    formula: scaleModifications(MINOR_SCALE, [[2, -1]])
},
{
    text: 'Lydian',
    formula: scaleModifications(MAJOR_SCALE, [[4, 1]])
},
{
    text: 'Mixolydian',
    formula: scaleModifications(MAJOR_SCALE, [[7, -1]])
},
{
    text: 'Aeolian',
    formula: MINOR_SCALE
},
{
    text: 'Locrian',
    formula: scaleModifications(MINOR_SCALE, [[2, -1], [5, -1]])
}];



export default function Scales() {
    const { leadingNote, setLeadingNote,

        autoProceeding,

        scaleType, setScaleType,
        notes, setNotes,
        setPage } = useContext(PianoContext);

    const [isDone, setIsDone] = useState(false);

    const resetNotes = () => {
        setNotes({});
        reset();
        setLeadingNote(NOTES[Math.floor(Math.random() * NOTES.length)]);
        setScaleType(ScaleTypes[Math.floor(Math.random() * ScaleTypes.length)]);
    }

    useEffect(() => {
        resetNotes();
        setPage('scales');
    }, []);

    useEffect(() => {
        let uniqueNotes = new Set();
        const normaliziedNotes = Object.entries(notes).filter(([_, validityValue]) => validityValue).map(([midiNumber, _]) => (parseInt(midiNumber) + 12) % 12);
        for (const note of normaliziedNotes) {
            uniqueNotes.add(note);
            if (scaleType['formula'] && uniqueNotes.size === scaleType['formula'].length) {
                setIsDone(true);
                if (autoProceeding) setTimeout(resetNotes, 1300);
                return;
            }
        }

        setIsDone(false);
    }, [notes, autoProceeding])

    return <h1>{leadingNote} {scaleType['text']}
        <button
            className={isDone ? 'selected' : 'not-selected'}
            onClick={resetNotes}>reset
        </button>
    </h1>
}