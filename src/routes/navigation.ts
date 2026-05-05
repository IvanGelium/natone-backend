import { Router } from 'express'
import {
  getNavigation,
} from '@/controllers/navigation'

const navigation = Router()

navigation.get('/', getNavigation)

export default navigation
