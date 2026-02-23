import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogInIcon, Mail, Lock } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'

const INITIAL_FORM = { email: "", password: "" }

const FIELDS = [
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
  { name: "password", type: "password", placeholder: "Password", icon: Lock, isPassword: true },
]

function Login({ onSubmit, onSwitchMode }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [rememberme, setRememberme] = useState(false)
  const navigate = useNavigate()
  const url = 'http://localhost:5000'

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
     
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (data.success) {
            onSubmit?.({ token, ...data.user })
            toast.success("Session restored. Redirecting...")
            navigate('/')
          } else {
            localStorage.clear()
          }
        } catch {
          localStorage.clear()
        }
      })() 
    }
  }, [navigate, onSubmit])

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rememberme) {
      toast.error('You must enable "Remember Me" to login.')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData)
      if (!data.token) throw new Error(data.message || "Login failed.")
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.user.id)
      setFormData(INITIAL_FORM)
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user })
      toast.success("Login successful! Redirecting...")
      setTimeout(() => navigate('/'), 1000)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md bg-white w-full shadow-lg border border-blue-100 rounded-xl p-8'>
      <ToastContainer position='top-center' autoClose={3000} hideProgressBar />
      <div className='mb-6 text-center'>
        <div className='w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4'>
          <LogInIcon className='w-8 h-8 text-white' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Welcome Back</h2>
        <p className='text-gray-500 text-sm mt-1'>Sign in to continue to TaskManager</p>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className="flex items-center border border-blue-600 rounded-lg px-3 py-2.5 ">
            <Icon className='text-blue-500 w-5 h-5 mr-2' />
            <input
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className='w-full focus:outline-none text-sm text-gray-700'
              required
            />
            {isPassword && (
              <button type='button' onClick={() => setShowPassword(prev => !prev)}
                className='ml-2 text-gray-500 hover:text-blue-500 transition-colors'>
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            )}
          </div>
        ))}
        <div className='flex items-center'>
          <input type='checkbox' id='rememberme' checked={rememberme}
            onChange={() => setRememberme(!rememberme)}
            className='h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded' />
          <label htmlFor="rememberme" className='ml-2 block text-sm text-gray-700'>Remember Me</label>
        </div>
        <button type='submit' className='w-full bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2' disabled={loading}>
          {loading ? "Logging in..." : <><LogInIcon className='w-4 h-4' />Log In</>}
        </button>
      </form>
      <p className='text-center text-sm text-gray-600 mt-6'>
        Don't have an account?{' '}
        <button type='button'
          className='text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors'
          onClick={handleSwitchMode}>
          Sign Up
        </button>
      </p>
    </div>
  )
}

export default Login