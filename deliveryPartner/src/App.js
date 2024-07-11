import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import Login from './components/login';
import { Route , Routes } from 'react-router-dom';

const App = () => {
  return(
    <>
    <Routes>
      <Route path='/' element={<Login />}/>
    </Routes>
    </>
  )
};

export default App;
