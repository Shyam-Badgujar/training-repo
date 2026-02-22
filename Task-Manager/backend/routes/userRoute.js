import express from 'express'
import { registerUser, loginUser, getCurrentUser, updateProfile } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/auth.js'
const UserRouter = express.Router()

UserRouter.post('/register', registerUser)
UserRouter.post('/login', loginUser)
UserRouter.get('/me',authMiddleware,getCurrentUser)
UserRouter.put('/profile',authMiddleware, updateProfile)




export default UserRouter 