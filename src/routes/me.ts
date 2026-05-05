import { Router } from 'express'
import {
  getMe,
} from '@/controllers/me'

const navigation = Router()

navigation.get('/', getMe)

export default navigation
