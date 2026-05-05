import { Router } from 'express'
import {
  createStage,
  deleteStage,
  editStage,
  getStage,
  getStageById,

} from '@/controllers/stage'
// import { validate } from '@/middleware'

const conspect = Router()

conspect.get('/', getStage)
conspect.get('/:id', getStageById)
conspect.post('/', createStage)
conspect.patch('/:id', editStage)
conspect.delete('/:id', deleteStage)

export default conspect
