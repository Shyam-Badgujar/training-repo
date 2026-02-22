import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSettingsOutline } from "react-icons/io5"
import { ChevronDown, LogOut } from 'lucide-react'

function Navbar({ user = {}, onLogout }) {
  const menuref = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  // BUG: missing dependency array - was re-adding listener on every render
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    onLogout()
  }

  return (
    <header className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
      <div className='flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto'>
        <div className='flex items-center gap-2 cursor-pointer group text-xl font-bold text-gray-800'
          onClick={() => navigate('/')}>Task Manager</div>
        <div className='flex items-center gap-4'>
          <button className='p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full'
            onClick={() => navigate('/profile')}>
            <IoSettingsOutline className="w-5 h-5" />
          </button>
          <div ref={menuref} className='relative'>
            <button onClick={() => setMenuOpen(prev => !prev)}
              className='flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors duration-300 border border-transparent hover:border-gray-300'>
              <div className='relative'>
                {user.avatar ? (
                  <img src={user.avatar} alt='avatar' className='w-9 h-9 rounded-full shadow-sm' />
                ) : (
                  <div className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-200'>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className='text-left hidden md:block'>
                <p className='text-sm font-medium text-gray-800'>{user.name}</p>
                <p className='text-xs text-gray-500'>{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            {menuOpen && (
              <ul className='absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden'>
                <li className='p-2'>
                  <button onClick={() => { setMenuOpen(false); navigate('/profile') }}
                    className='w-full px-4 text-sm flex items-center py-2.5 text-left gap-2 text-gray-700 hover:bg-gray-100'>
                    <IoSettingsOutline className='w-4 h-4' /> Profile Settings
                  </button>
                </li>
                <li className='p-2'>
                 <button onClick={handleLogout}
                    className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600'>
                    <LogOut className="w-4 h-4 text-red-600" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar