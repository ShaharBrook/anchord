import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
    return <nav>
        <div>
            <Link to="/scales">Scales</Link>
        </div>
        <div>
            <Link to="/chords">Chords</Link>
        </div>
        <div>
            <Link to="/intervals">Intervals</Link>
        </div>
    </nav>
}