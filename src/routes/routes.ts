import { Router } from 'express'
import authRouter from './auth'
import chapterRouter from './chapter'
import conspectRouter from './conspect'
import meRouter from './me'
import navigationRouter from './navigation'
import stageRouter from './stage'
import userRouter from './user'
import practiceRouter from './practice'

const router = Router()
router.use('/conspects', conspectRouter)
router.use('/chapters', chapterRouter)
router.use('/stages', stageRouter)
router.use('/practicies', practiceRouter)
router.use('/navigation', navigationRouter)
router.use('/users', userRouter)
router.use('/auth', authRouter)
router.use('/me', meRouter)

export default router
