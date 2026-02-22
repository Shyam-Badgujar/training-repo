import { TimerProvider } from '../context/TimerContext.jsx'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
    <TimerProvider>
    <App />
    </TimerProvider>
</BrowserRouter>

)
