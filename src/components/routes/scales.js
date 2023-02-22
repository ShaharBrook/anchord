import { useContext, useEffect } from 'react';
import PianoContext from './../../context/piano-context';

const NOTES = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b'];

export default function Scales() {
    const { leadingNote, setLeadingNote } = useContext(PianoContext);

    useEffect(() => {
        setLeadingNote(NOTES[Math.floor(Math.random()*NOTES.length)]);
    }, []);

    return <div>{leadingNote}</div>
}