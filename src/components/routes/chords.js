import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import PianoContext from './../../context/piano-context';

export default function Chords() {
    const { setPage } = useContext(PianoContext);

    const location = useLocation();

    useEffect(() => {
        setPage('chords');
    }, [location]);


    return <div><h1>Chords are not supported yet!</h1></div>
}