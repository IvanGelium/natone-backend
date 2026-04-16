import { Router } from 'express'
import {
  createConspect,
  deleteConspect,
  editConspect,
  getConspectById,
  getConspects,
} from '@/controllers/conspect'
import { validate } from '@/middleware'
import { createConspectSchema } from '@/schemas/conspect'

const conspect = Router()

conspect.get('/', getConspects)
conspect.get('/:id', getConspectById)
conspect.post('/', validate(createConspectSchema), createConspect)
conspect.post('/:id', validate(createConspectSchema), editConspect)
conspect.delete('/:id', deleteConspect)

export default conspect
