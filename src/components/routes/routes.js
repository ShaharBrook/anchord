import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Chords from './chords';
import Scales from './scales';
import Intervals from './intervals';

import Navbar from './../navbar/navbar';

export const defaultRoute = 'scales';

export default function MyRoutes() {

  return <Router>
    <Navbar />
    <Routes>
      <Route path='/' exact element={<Scales />} />
      <Route path='/scales' exact element={<Scales />} />
      <Route path='/intervals' exact element={<Intervals />} />
      <Route path='/chords' exact element={<Chords />} />
    </Routes>
  </Router>;
}