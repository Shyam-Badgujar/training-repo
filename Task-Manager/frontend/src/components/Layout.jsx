import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import { Circle, Clock, TrendingUp, Zap } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'

function Layout({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      // BUG FIX: was calling localhost:5173 (frontend) and had /gp suffix
      const { data } = await axios.get("http://localhost:5000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` }
      })

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : []
      setTasks(arr)
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks')
      if (err.response?.status === 401) onLogout()
    } finally {
      setLoading(false)
    }
  }, [onLogout])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task =>
      task.completed === true ||
      task.completed === 1 ||
      (typeof task.completed === 'string' && task.completed.toLowerCase() === 'yes')
    ).length
    const totalCount = tasks.length
    const pendingCount = totalCount - completedTasks
    const completionPercentage = totalCount ? Math.round((completedTasks / totalCount) * 100) : 0
    return { completedTasks, pendingCount, totalCount, completionPercentage }
  }, [tasks])

  const StatCard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-gray-300">
      <div className='flex items-center gap-2'>
        <div className="p-1.5 sm:p-3 from-blue-50 to-indigo-50 flex items-center gap-3 rounded-lg">
          {icon}
        </div>
        <div className='min-w-0'>
          <p className="truncate text-sm font-medium text-gray-700">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
        <div className='bg-red-50 text-red-500 text-lg p-4 rounded-xl border border-red-100 max-w-md'>
          <p className='font-medium mb-2'>Error Loading Tasks</p>
          <p className='text-sm'>{error}</p>
          <button
            onClick={fetchTasks}
            className='mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors'>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className='ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
          <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className='xl:col-span-1 space-y-4 sm:space-y-6'>
            <div className='bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100'>
              <h3 className='text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 font-semibold text-gray-800'>
                <TrendingUp className='w-4 h-4 sm:h-5 sm:w-5 text-purple-500' />
                Task Statistics
              </h3>
              <div className='grid grid-cols-2 gap-4 mb-4 sm:mb-6'>
                <StatCard title="Total Tasks" value={stats.totalCount} icon={<Circle className='w-3.5 h-3.5 sm:h-4 sm:w-4 text-blue-500' />} />
                <StatCard title="Completed" value={stats.completedTasks} icon={<Circle className='w-3.5 h-3.5 sm:h-4 sm:w-4 text-green-500' />} />
                <StatCard title="Pending" value={stats.pendingCount} icon={<Circle className='w-3.5 h-3.5 sm:h-4 sm:w-4 text-yellow-500' />} />
                <StatCard title="Completion Rate" value={`${stats.completionPercentage}%`} icon={<Zap className='w-3.5 h-3.5 sm:h-4 sm:w-4 text-purple-500' />} />
              </div>
              <hr className='my-3 sm:my-4 border-purple-100' />
              <div className='space-y-2 sm:space-y-3'>
                <div className='flex items-center justify-between text-gray-700'>
                  <span className='text-xs sm:text-sm font-medium flex items-center gap-1.5'>
                    <Circle className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500 fill-blue-500' />
                    Task Progress
                  </span>
                  <span className='text-xs bg-blue-100 text-blue-800 px-1.5 py-1.5 sm:px-2 rounded-full'>
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className='relative pt-1'>
                  <div className='flex-1 h-2 sm:h-3 bg-blue-100 rounded-full overflow-hidden'>
                    <div className='h-full'
                      style={{ width: `${stats.completionPercentage}%`, backgroundColor: '#3b82f6' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100'>
              <h3 className='text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 font-semibold text-gray-800'>
                <Clock className='w-4 h-4 sm:h-5 sm:w-5 text-purple-500' />
                Recent Activity
              </h3>
              <div className='space-y-2 sm:space-y-3'>
                {tasks.slice(0, 3).map((task) => (
                  <div key={task._id || task.id} className='flex items-center gap-2 text-sm'>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-700  whitespace-normal'>
                        {task.title}
                      </p>
                      {/* BUG FIX: toLocaleDateString(0) is invalid - should be no arg or locale string */}
                      <p className='text-xs text-gray-500 mt-1'>
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "No Date"}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs shrink-0 ml-2 rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className='text-center py-4 px-2 sm:py-6'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mb-4 rounded-full bg-purple-100 flex items-center justify-center'>
                      <Clock className='w-6 h-6 sm:w-8 sm:h-8 text-purple-500' />
                    </div>
                    <p className='text-sm sm:text-base text-gray-500'>No recent activity</p>
                    <p className='text-sm text-gray-400 mt-1'>Create tasks to see recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout