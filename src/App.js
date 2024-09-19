import React from 'react';
import LoginForm from './components/loginform/LoginForm';
import RegisterForm from './components/registerform/RegisterForm';
import HomePage from './components/pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import ChillPage from './components/pages/ChillPage';
import AdminPage from './components/admin/admin';
import BGPage from './components/admin/BGPage/BGPage';

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;