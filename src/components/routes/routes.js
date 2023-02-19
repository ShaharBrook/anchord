import { createBrowserRouter } from 'react-router-dom';

import Chords from './chords';
import Scales from './scales';

export const router = createBrowserRouter([
  {
    element: <Scales />,
    path: '/',
  },
  {
    element: <Scales />,
    path: 'scales',
  },
  {
    element: <Chords />,
    path: 'chords',
  },
]);