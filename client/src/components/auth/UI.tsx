import React from 'react';
import { logout } from '@/store/authSlice';
import {useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store'

const UI = () => {
     const navigate = useNavigate();
      const dispatch = useAppDispatch();

      const onLogout = (): void => {
        dispatch(logout())
        setTimeout(()=> navigate('/'),1000)
      }

  return (
    <div>
      <button onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}

export default UI
