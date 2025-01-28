import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {

  const navigate = useNavigate();
  const isLogin = localStorage.getItem('isLoggedIn') == 'true';

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [])

  return (
    <>
      <WidgetsDropdown className="mb-4" />
    </>
  )
}

export default Dashboard
