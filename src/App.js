import React from 'react';
import LoginForm from './components/loginform/LoginForm';
import RegisterForm from './components/registerform/RegisterForm';
import HomePage from './components/pages/HomePage';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'; 
import ChillPage from './components/pages/ChillPage';
import AdminPage from './components/admin/admin';
import BGPage from './components/admin/BGPage/BGPage';
import SongPage_ad from './components/admin/SongPage/SongPage_ad';
import PresetPage from './components/admin/PresetPage/PresetPage';
import SoundPage from './components/admin/SoundPage/SoundPage';
import ArtistPage from './components/pages/ArtistPage/ArtistPage';
import SongPage from './components/pages/SongPage/SongPage';
import SongDetail from './components/pages/SongPage/SongDetail/SongDetail';
import ArtistPage_ad from './components/admin/ArtistPage_ad/ArtistPage_ad';
import ArtistDetail from './components/pages/ArtistPage/ArtistDetail/ArtistDetail';
import ResetPassword from './components/pages/ResetPassword';
import VIP from './components/pages/VIP/VIP';

function App() {

  function ArtistDetailWrapper() {
    const { id } = useParams(); 
    return <ArtistDetail key={id} />;
  };

  function SongDetailWrapper(){
    const { id } = useParams();
    return <SongDetail key = {id} />;
  };

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
          <Route path='/ArtistPage/:id' element={<ArtistDetail  />} element={<ArtistDetailWrapper />} />
          <Route path='/SongPage' element={<SongPage />} />
          <Route path='/SongPage/:id' element={<SongDetail />} element={<SongDetailWrapper />} />
          <Route path='/ArtistPage_ad' element={<ArtistPage_ad />} />
          <Route path='/ResetPassword' element={<ResetPassword />} />
          <Route path= '/VIP' element={<VIP/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;