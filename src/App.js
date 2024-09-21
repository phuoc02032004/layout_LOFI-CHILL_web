import React from 'react';
import LoginForm from './components/loginform/LoginForm';
import RegisterForm from './components/registerform/RegisterForm';
import HomePage from './components/pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import ChillPage from './components/pages/ChillPage';
import AdminPage from './components/admin/admin';
import BGPage from './components/admin/BGPage/BGPage';
import SongPage from './components/admin/SongPage/SongPage';
import PresetPage from './components/admin/PresetPage/PresetPage';
import SoundPage from './components/admin/SoundPage/SoundPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/chillpage" element={<ChillPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/BGPage" element={<BGPage />} />
          <Route path="/SongPage" element={<SongPage />} />
          <Route path="/PresetPage" element={<PresetPage />} />
          <Route path="/SoundPage" element={<SoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;