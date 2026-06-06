import { Router } from 'express'
import {
  key,
  login,
} from '@/controllers/auth'

const auth = Router()

auth.post('/', login)
auth.post('/key', key)

export default auth
