import { Router } from 'express'
import {
  createChapter,
  deleteChapter,
  editChapter,
  getChapter,
  getChapterById,

} from '@/controllers/chapter'
// import { validate } from '@/middleware'

const chapter = Router()

chapter.get('/', getChapter)
chapter.get('/:id', getChapterById)
chapter.post('/', createChapter)
chapter.patch('/:id', editChapter)
chapter.delete('/:id', deleteChapter)

export default chapter
