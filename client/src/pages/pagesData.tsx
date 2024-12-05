import { routerType } from '../types/router.types';
import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';

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
  {
    path: 'login',
    element: <Login />,
    title: 'login',
  },
  {
    path: 'signup',
    element: <Signup />,
    title: 'signup',
  },
];

export default pagesData;
