import React from 'react';
import LoginForm from './components/loginform/LoginForm';
import RegisterForm from './components/registerform/RegisterForm';
import HomePage from './components/pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import ChillPage from './components/pages/ChillPage';
import AdminPage from './components/admin/admin';
import BGPage from './components/admin/BGPage/BGPage';
import SongPage_ad from './components/admin/SongPage/SongPage_ad';
import PresetPage from './components/admin/PresetPage/PresetPage';
import SoundPage from './components/admin/SoundPage/SoundPage';
import ArtistPage from './components/pages/ArtistPage/ArtistPage';
import SongPage from './components/pages/SongPage/SongPage';
import ArtistPage_ad from './components/admin/ArtistPage_ad/ArtistPage_ad';

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
          <Route path="/SongPage_ad" element={<SongPage_ad />} />
          <Route path="/PresetPage" element={<PresetPage />} />
          <Route path="/SoundPage" element={<SoundPage />} />
          <Route path='/ArtistPage' element={<ArtistPage />} />
          <Route path='/SongPage' element={<SongPage />} />
          <Route path='/ArtistPage_ad' element={<ArtistPage_ad />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;