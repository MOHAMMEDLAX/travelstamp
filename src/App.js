import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddVisit from './pages/AddVisit';
import MapView from './pages/MapView';
import Stats from './pages/Stats';
import VisitDetail from './pages/VisitDetail';
import EditVisit from './pages/EditVisit';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { AppProvider } from './context/AppContext';

function App() {
  const token = localStorage.getItem('token');

  return (
     <AppProvider>
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-visit" element={<AddVisit />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/visit/:id" element={<VisitDetail />} />
        <Route path="/edit-visit/:id" element={<EditVisit />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      
    </BrowserRouter>
    </AppProvider>
  );
}

export default App;