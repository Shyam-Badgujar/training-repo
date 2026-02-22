import express from 'express'
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js'
import { authMiddleware } from '../middleware/auth.js'

const taskRouter = express.Router()

taskRouter.route('/')
  .post(authMiddleware, createTask)
  .get(authMiddleware, getTasks)

taskRouter.route('/:id')
  .get(authMiddleware, getTaskById)
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask)

export default taskRouter