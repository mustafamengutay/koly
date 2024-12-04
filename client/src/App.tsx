import { BrowserRouter } from 'react-router';
import Router from './pages/router';
import AppLayout from './components/layouts/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Router />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
