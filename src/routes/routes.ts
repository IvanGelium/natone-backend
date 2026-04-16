import { Router } from 'express'
import conspectRouter from './conspect'

const router = Router()
router.use('/conspects', conspectRouter)

export default router
