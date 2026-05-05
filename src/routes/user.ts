import { Router } from 'express'
import {
  createUser,
  deleteUser,
  editUser,
  forceDeleteUser,
  getUserById,
  getUsers,
} from '@/controllers/user'
// import { validate } from '@/middleware'
// import { createUserSchema } from '@/schemas/User'

const user = Router()

user.get('/', getUsers)
user.post('/', createUser)
user.get('/:id', getUserById)
user.patch('/:id', editUser)
// User.post('/:id', validate(createUserSchema), editUser)
user.delete('/:id', deleteUser)
user.delete('/force/:id', forceDeleteUser)

export default user
