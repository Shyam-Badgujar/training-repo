
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import UserRouter from './routes/userRoute.js'
import TaskRouter from './routes/taskRoute.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.use('/api/user', UserRouter)
app.use('/api/tasks', TaskRouter)

app.get('/', (req, res) => res.send('Hello, World!'))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))