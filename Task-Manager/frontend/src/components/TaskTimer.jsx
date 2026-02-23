
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useTimer } from '../../context/TimerContext.jsx'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function TaskTimer({ taskId }) {
  const { activeTaskId, times, startTimer, pauseTimer, resetTimer } = useTimer()

  const isRunning = activeTaskId === taskId
  const elapsed = times[taskId] || 0

  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer(taskId)
    }
  }

  const handleReset = () => {
    resetTimer(taskId)
  }

  return (
    <div className='flex items-center gap-2 mt-2'>
      <div className={`font-mono text-sm px-2 py-1 rounded-lg  text-center font-semibold
        ${isRunning
          ? 'bg-blue-100 text-blue-700 animate-pulse'
          : elapsed > 0
          ? 'bg-gray-100 text-gray-700'
          : 'bg-gray-50 text-gray-400'
        }`}>
        {formatTime(elapsed)}
      </div>

      <button
        onClick={handleStartPause}
        title={isRunning ? 'Pause Timer' : 'Start Timer'}
        className={`p-1.5 rounded-lg transition-colors duration-200
          ${isRunning
            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
            : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}>
        {isRunning
          ? <Pause className='w-3.5 h-3.5' />
          : <Play className='w-3.5 h-3.5' />
        }
      </button>

      {/* Reset */}
      <button
        onClick={handleReset}
        title='Reset Timer'
        disabled={elapsed === 0 && !isRunning}
        className='p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed'>
        <RotateCcw className='w-3.5 h-3.5' />
      </button>

      {/* Running indicator */}
      {isRunning && (
        <span className='text-xs text-blue-500 font-medium animate-pulse'>
          Running...
        </span>
      )}
    </div>
  )
}

export default TaskTimer