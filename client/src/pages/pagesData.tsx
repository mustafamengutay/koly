import { routerType } from '../types/router.types';
import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ProjectBoard from './ProjectBoard';

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
  {
    path: 'projects/:projectId',
    element: <ProjectBoard />,
    title: 'projects',
  },
];

export default pagesData;
