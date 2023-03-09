import { useContext, useEffect, useState } from 'react';
import PianoContext from '../../../context/piano-context';
import { reset } from '../../my-piano/my-piano';
import { scaleModifications } from '../scales';

import './chords.css';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Ab', 'Bb', 'Db', 'Eb', 'Gb'];

const Triads = { 'major': [4, 7], 'minor': [3, 7], 'diminished': [3, 6], 'augmented': [4, 8] };
const Sevenths = { 'dim7': [9], '7': [10], 'maj7': [11] };
const Ninths = { 'b9': [1], '9': [2], '#9': [3] };
const Eleventh = { 'b11': [4], '11': [5], '#11': [6] };
const Thirteenth = { 'b13': [8], '13': [9], '#13': [10] };

const pickRandomEntry = (entries, constraint = () => true) => {
    const options = Object.entries(entries).filter(([entry, selection]) => selection && constraint(entry)).map(([entry]) => entry);
    return options[Math.floor(Math.random() * options.length)];
}

const pickRandomStructure = (triadTypes, seventhTypes, ninthTypes, eleventhTypes, thirteenthTypes) => {
    const triadType = pickRandomEntry(triadTypes);

    let seventhConstraint = (entry) => entry !== 'dim7';
    if (triadType === 'diminished') {
        seventhConstraint = () => true; // allowing dim7 on diminshed triads only
    }
    const seventhType = pickRandomEntry(seventhTypes, seventhConstraint);

    let ninthConstraint = (entry) => entry !== 'b9';
    if ((triadType === 'major' || triadType === 'augmented') && seventhType === '7') {
        ninthConstraint = () => true; // allowing b9 on dom7 only
    }
    const ninthType = pickRandomEntry(ninthTypes, ninthConstraint);

    let eleventhConstraint = () => true;
    if (triadType === 'major' || triadType === 'augmented') {
        eleventhConstraint = () => false; // forbidding 11 on major chords
    }
    const eleventhType = pickRandomEntry(eleventhTypes, eleventhConstraint);

    let thirteenthConstraint = () => false;
    if (triadType === 'major' || triadType === 'augmented') {
        thirteenthConstraint = () => true; // allowing 13 on major chords
    }
    const thirteenthType = pickRandomEntry(thirteenthTypes, thirteenthConstraint);

    return { triadType, seventhType, ninthType, eleventhType, thirteenthType };
}

const generateChordIntervals = (chordStructure) => {
    const { triadType, seventhType, ninthType, eleventhType, thirteenthType } = chordStructure;
    let intervals = [0];
    if (triadType) intervals = intervals.concat(Triads[triadType]);
    if (seventhType) intervals = intervals.concat(Sevenths[seventhType]);
    if (ninthType) intervals = intervals.concat(Ninths[ninthType]);
    if (eleventhType) intervals = intervals.concat(Eleventh[eleventhType]);
    if (thirteenthType) intervals = intervals.concat(Thirteenth[thirteenthType]);
    return intervals;
};

const generateChordName = (chordStructure) => {
    const { triadType, seventhType, ninthType, eleventhType, thirteenthType } = chordStructure;
    let name = '';
    if (triadType === 'major') {
        switch (seventhType) {
            case 'maj7': name += 'maj7'; break;
            case '7': name += '7'; break;
            default: name += '';
        }
    } else if (triadType === 'minor') {
        switch (seventhType) {
            case 'maj7': name += 'mmaj7'; break;
            case '7': name += 'm7'; break;
            default: name += 'm';
        }
    } else if (triadType === 'diminished') {
        switch (seventhType) {
            case 'maj7': name += 'dimmaj7'; break;
            case '7': name += 'm7b5'; break;
            case 'dim7': name += 'dim7'; break;
            default: name += 'dim';
        }
    } else if (triadType === 'augmented') {
        switch (seventhType) {
            case 'maj7': name += 'augmaj7'; break;
            case '7': name += 'aug7'; break;
            default: name += 'aug';
        }
    } else {
        return '? Please keep at least one triad option selected'
    }

    if (ninthType) name += ninthType;
    if (eleventhType) name += eleventhType;
    if (thirteenthType) name += thirteenthType;

    return name;
};

const initDict = (dict) => {
    return Object.keys(dict).reduce((total, curr, index) => {
        total[curr] = index === 0;
        return total;
    }, {})
}

export default function Chords() {
    const { leadingNote, setLeadingNote,

        autoProceeding,

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
        const chordStructure = pickRandomStructure(triadTypes, seventhTypes, ninthTypes, eleventhTypes, thirteenthTypes);
        const intervals = generateChordIntervals(chordStructure);
        const name = generateChordName(chordStructure);

        setChordType({ intervals, name });
    }

    useEffect(() => {
        setTriadTypes(initDict(Triads));
        setSeventhTypes(initDict(Sevenths));
        setNinthTypes(initDict(Ninths));
        setEleventhTypes(initDict(Eleventh));
        setThirteenthTypes(initDict(Thirteenth));
        resetNotes();
        setPage('chords');
    }, []);

    useEffect(() => {
        if ([triadTypes, seventhTypes, ninthTypes, eleventhTypes, thirteenthTypes].every(dict => Object.keys(dict).length)) {
            resetChord();
        }
    }, [triadTypes, seventhTypes, ninthTypes, eleventhTypes, thirteenthTypes]);

    useEffect(() => {
        let uniqueNotes = new Set();
        const normaliziedNotes = Object.entries(notes).filter(([_, validityValue]) => validityValue).map(([midiNumber, _]) => (parseInt(midiNumber) + 12) % 12);
        for (const note of normaliziedNotes) {
            uniqueNotes.add(note);
            if (chordType['intervals'] && uniqueNotes.size === chordType['intervals'].length) {
                setIsDone(true);
                if (autoProceeding) setTimeout(resetNotes, 1300);
                return;
            }
        }

        setIsDone(false);
    }, [notes, autoProceeding]);

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

    const toggleEleventh = (eleventh) => () => {
        setEleventhTypes({
            ...eleventhTypes,
            [eleventh]: !eleventhTypes[eleventh]
        })
    };

    const toggleThirteenth = (thirteenth) => () => {
        setThirteenthTypes({
            ...thirteenthTypes,
            [thirteenth]: !thirteenthTypes[thirteenth]
        })
    };

    return <div className='chords'>
        <h1>{leadingNote}{chordType.name}
            <button
                className={isDone ? 'selected' : 'not-selected'}
                onClick={resetNotes}>reset
            </button>
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
            <div className='elevenths'>
                {Object.keys(Eleventh).map((eleventh) => <button
                    key={eleventh}
                    className={eleventhTypes[eleventh] ? 'selected' : 'not-selected'}
                    onClick={toggleEleventh(eleventh)}>
                    {eleventh}
                </button>)}
            </div>
            <div className='thirteenths'>
                {Object.keys(Thirteenth).map((thirteenth) => <button
                    key={thirteenth}
                    className={thirteenthTypes[thirteenth] ? 'selected' : 'not-selected'}
                    onClick={toggleThirteenth(thirteenth)}>
                    {thirteenth}
                </button>)}
            </div>
        </div>
    </div>
}