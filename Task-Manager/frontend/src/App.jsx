import React, { useEffect, useState } from 'react'
import { Routes, useNavigate, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Signup from './components/Signup'
import { Outlet } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PendingPages from './pages/PendingPages'
import CompletePages from './pages/CompletePages'
import Profile from './components/Profile'

function App() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name,
      avatar: `https://ui-avatars.com/api/?name=${data.name}&background=random`
    }
    setCurrentUser(user)
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser') // BUG: was not clearing currentUser
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  const ProtectedLayout = () => (
    <Layout onLogout={handleLogout} user={currentUser}>
      <Outlet />
    </Layout>
  )

  return (
    <Routes>
      <Route path="/login" element={
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
        </div>
      } />
      <Route path="/signup" element={
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      
          <Signup onSwitchMode={() => navigate('/login')} />
        </div>
      } />
      <Route element={currentUser ? <ProtectedLayout /> : <Navigate to='/login' replace />}>
        <Route path="/" element={<Dashboard />} />
        <Route path='/pending' element={<PendingPages />} />
        <Route path='/complete' element={<CompletePages />} />
        <Route path='/profile' element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>
      <Route path='*' element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App