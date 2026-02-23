import { LINK_CLASSES } from '../assets/dummy.jsx'
import { NavLink } from 'react-router-dom'

const menuItems = [
    { text: "Dashboard", path: "/" },
    { text: "Pending Tasks", path: "/pending"},
    { text: "Completed Tasks", path: "/complete" },
]


function Sidebar({user}) {
  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()



  const renderMenuItems = (isMobile = false) => (
    <ul className='space-y-2'>
      {menuItems.map(({ text, path}) => (
        <li key={text}>
          <NavLink to={path} className={({ isActive }) => [
            LINK_CLASSES.base,
            isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
            isMobile ? 'justify-start' : 'lg:justify-start'
          ].join(" ")} >    
            <span className={`${LINK_CLASSES.text}  'hidden lg:block'`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <div className="hidden md:flex flex-col fixed h-full w-20 lg:w-64 bg-white/90 backdrop-blur-sm border-r border-purple-100 shadow-sm z-20 transition-all duration-300">
        <div className='p-5 border-b border-blue-100 lg:block hidden'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full flex items-center justify-center text-white bg-black font-bold shadow-md'>
              {initial}
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-800'>Hey, {username} </h2>
            </div>
          </div>
        </div>

        <div className='p-4 space-y-6 overflow-y-auto flex-1'>
          {renderMenuItems()}
        </div>
      </div>
    </>
  )
}

export default Sidebar