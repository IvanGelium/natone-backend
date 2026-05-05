import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { processSelect } from '@/utils/utils'

export async function getChapter(req: Request, res: Response) {
  // const { fields } = req.query
  // let select
  // if (typeof fields === 'string')
  //   select = processSelect(fields)
  const items = await prisma.chapter.findMany({
    select: {
      id: true,
      title: true
  } })
  res.json(items)
}

export async function getChapterById(req: Request, res: Response) {
  const { fields } = req.query
  const id = Number(req.params.id)
  let select
  if (typeof fields === 'string')
    select = processSelect(fields)

  const conspect = await prisma.chapter.findUnique({
    where: {
      id,
    },
    select,
  })
  res.json(conspect)
}

export async function createChapter(req: Request, res: Response) {
  const { stageId, title } = req.body
  const chapter = await prisma.chapter.create({
    data: {
      stageId: Number(stageId),
      title,
  } })
  res.json(chapter)
}

export async function editChapter(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { stageId, title } = req.body
  console.log(stageId, title)
  const chapter = await prisma.chapter.update({
    where: { id },
    data: {
      stageId: Number(stageId),
      title,
   } 
  })
  res.json(chapter)
}

export async function deleteChapter(req: Request, res: Response) {
  const id = Number(req.params.id)
    if (id === 1) {
    return res.status(400).json('Нельзя удалить стандартную главу')
  }
  const chapter = await prisma.chapter.delete({
    where: { id },
  })
  res.json(chapter)
}
