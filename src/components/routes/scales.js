import { useContext, useEffect } from 'react';
import PianoContext from './../../context/piano-context';

const NOTES = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b'];
const ScaleTypes = [{
    text: 'Aeolien',
    formula: [0, 2, 4, 5, 7, 9, 11]
}];

export default function Scales() {
    const { leadingNote, setLeadingNote, scaleType, setScaleType } = useContext(PianoContext);

    useEffect(() => {
        setLeadingNote(NOTES[Math.floor(Math.random()*NOTES.length)]);
        setScaleType(ScaleTypes[Math.floor(Math.random()*ScaleTypes.length)]);
    }, []);

    return <div>{leadingNote} {scaleType['text']}</div>
}