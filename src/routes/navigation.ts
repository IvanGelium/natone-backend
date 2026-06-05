import { Router } from 'express'
import {
  getNavigation,
  setNavigationOrder,
} from '@/controllers/navigation'

const navigation = Router()

navigation.get('/', getNavigation)
navigation.post('/:entity', setNavigationOrder)

export default navigation
