import { Router } from 'express'
import {
  createPractice,
  deletePractice,
  editPractice,
  getPractice,
  getPracticeById,

} from '@/controllers/practice'
// import { validate } from '@/middleware'

const practice = Router()

practice.get('/', getPractice)
practice.get('/:id', getPracticeById)
practice.post('/', createPractice)
practice.patch('/:id', editPractice)
practice.delete('/:id', deletePractice)

export default practice
