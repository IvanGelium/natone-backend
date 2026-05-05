import { Router } from 'express'
import {
  login,
} from '@/controllers/auth'

const auth = Router()

auth.post('/', login)

export default auth
