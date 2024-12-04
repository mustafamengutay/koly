import { routerType } from '../types/router.types';
import Dashboard from './Dashboard';
import Home from './Home';

const pagesData: routerType[] = [
  {
    path: '',
    element: <Home />,
    title: 'home',
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
    title: 'dashboard',
  },
];

export default pagesData;
