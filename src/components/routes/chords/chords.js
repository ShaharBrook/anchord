import { useContext, useEffect, useState } from 'react';
import PianoContext from '../../../context/piano-context';
import { reset } from '../../my-piano/my-piano';
import { scaleModifications } from '../scales';

import './chords.css';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Ab', 'Bb', 'Db', 'Eb', 'Gb'];

const Triads = { 'major': [4, 7], 'minor': [3, 7], 'diminished': [3, 6], 'augmented': [4, 8] };
const Sevenths = { 'dim7': [9], '7': [10], 'maj7': [11] };
const Ninths = { 'b9': [1], '9': [2], '#9': [3] };

const pickRandomEntry = (entries, constraint = () => true) => {
    const options = Object.entries(entries).filter(([entry, selection]) => selection && constraint(entry)).map(([entry]) => entry);
    return options[Math.floor(Math.random() * options.length)];
}

const pickRandomStructure = (triadTypes, seventhTypes, ninthTypes, eleventhTypes, thirteenthTypes) => {
    const triadType = pickRandomEntry(triadTypes);
    const seventhType = pickRandomEntry(seventhTypes);
    let ninthConstraint = (entry) => entry !== 'b9';
    if (triadType === 'major' && seventhType === '7') {
        ninthConstraint = (entry) => true;
    }
    const ninthType = pickRandomEntry(ninthTypes, ninthConstraint);
    return { triadType, seventhType, ninthType };
}

const generateChordIntervals = (chordStructure) => {
    const { triadType, seventhType, ninthType } = chordStructure;
    let intervals = [0];
    intervals = intervals.concat(Triads[triadType]);
    intervals = intervals.concat(Sevenths[seventhType]);
    intervals = intervals.concat(Ninths[ninthType]);
    return intervals;
};

const generateChordName = (chordStructure) => {
    const { triadType, seventhType, ninthType } = chordStructure;
    let name = '';
    console.log(chordStructure);

    return '';
};

const initDict = (dict) => {
    return Object.keys(dict).reduce((total, curr) => {
        total[curr] = true;
        return total;
    }, {})
}

export default function Chords() {
    const { leadingNote, setLeadingNote,

        chordType, setChordType,
        triadTypes, setTriadTypes,
        seventhTypes, setSeventhTypes,
        ninthTypes, setNinthTypes,
        eleventhTypes, setEleventhTypes,
        thirteenthTypes, setThirteenthTypes,

        notes, setNotes,
        setPage } = useContext(PianoContext);

    const [isDone, setIsDone] = useState(false);

    const resetNotes = () => {
        setNotes({});
        reset();
        setLeadingNote(NOTES[Math.floor(Math.random() * NOTES.length)]);
    }

    const resetChord = () => {
        console.log({ triadTypes, seventhTypes, ninthTypes });
        const chordStructure = pickRandomStructure(triadTypes, seventhTypes, ninthTypes, eleventhTypes, thirteenthTypes);
        const intervals = generateChordIntervals(chordStructure);
        const name = generateChordName(chordStructure);

        setChordType({ intervals, name });
    }

    useEffect(() => {
        setTriadTypes(initDict(Triads));
        setSeventhTypes(initDict(Sevenths));
        setNinthTypes(initDict(Ninths));
        resetNotes();
        setPage('chords');
    }, []);

    useEffect(() => {
        if ([triadTypes, seventhTypes, ninthTypes/*, eleventhTypes, thirteenthTypes*/].every(dict => Object.keys(dict).length)) {
            resetChord();
        }
    }, [triadTypes, seventhTypes, ninthTypes, eleventhTypes, thirteenthTypes]);

    useEffect(() => {
        let uniqueNotes = new Set();
        const normaliziedNotes = Object.entries(notes).filter(([_, validityValue]) => validityValue).map(([midiNumber, _]) => (parseInt(midiNumber) + 12) % 12);
        for (const note of normaliziedNotes) {
            uniqueNotes.add(note);
            if (chordType['formula'] && uniqueNotes.size === chordType['formula'].length) {
                setIsDone(true);
                return;
            }
        }

        setIsDone(false);
    }, [notes]);

    const toggleTriad = (triad) => () => {
        setTriadTypes({
            ...triadTypes,
            [triad]: !triadTypes[triad]
        })
    };

    const toggleSeventh = (seventh) => () => {
        setSeventhTypes({
            ...seventhTypes,
            [seventh]: !seventhTypes[seventh]
        })
    };

    const toggleNinth = (ninth) => () => {
        setNinthTypes({
            ...ninthTypes,
            [ninth]: !ninthTypes[ninth]
        })
    };

    return <div className='chords'>
        <h1>{leadingNote}{chordType.name}
            {isDone && <button onClick={resetNotes}>reset</button>}
        </h1>
        <div className='menu'>
            <div className='triads'>
                {Object.keys(Triads).map((triad) => <button
                    key={triad}
                    className={triadTypes[triad] ? 'selected' : 'not-selected'}
                    onClick={toggleTriad(triad)}>
                    {triad}
                </button>)}
            </div>
            <div className='sevenths'>
                {Object.keys(Sevenths).map((seventh) => <button
                    key={seventh}
                    className={seventhTypes[seventh] ? 'selected' : 'not-selected'}
                    onClick={toggleSeventh(seventh)}>
                    {seventh}
                </button>)}
            </div>
            <div className='ninths'>
                {Object.keys(Ninths).map((ninth) => <button
                    key={ninth}
                    className={ninthTypes[ninth] ? 'selected' : 'not-selected'}
                    onClick={toggleNinth(ninth)}>
                    {ninth}
                </button>)}
            </div>
        </div>
    </div>
}