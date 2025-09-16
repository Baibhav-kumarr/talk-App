import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { AuthContext } from '../context/AuthContext.jsx';

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className='bg-[url("/bgImage.svg")] bg-contain'>
      <Toaster />
      <Routes>
        {/**we will check user is authenticated or not; if not authenticated he can't access
         * the homepage and profile page. If user is authenticated he goes to homepage or profile page */}
        <Route path='/' element={ authUser? <HomePage /> : <Navigate to="/login"/>} />
        <Route path='/login' element={ !authUser?  <LoginPage /> :<Navigate to="/"/> } />
        <Route path='/profile' element={ authUser? <ProfilePage />  :<Navigate to="/login"/>} />
      </Routes>  
    </div>
  );
};

export default App;