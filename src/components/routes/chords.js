import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import PianoContext from './../../context/piano-context';

export default function Chords() {
    const { setPage } = useContext(PianoContext);

    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
        setPage('chords');
        // Send request to your server to increment page view count
    }, [location]);


    return <div>Chords</div>
}