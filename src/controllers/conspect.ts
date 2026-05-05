import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { processSelect } from '@/utils/utils'

export async function getConspects(req: Request, res: Response) {
  const { fields } = req.query
  let select
  if (typeof fields === 'string')
    select = processSelect(fields)
  const items = await prisma.conspect.findMany({
    select,
  })
  res.json(items)
}

export async function getConspectById(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { fields } = req.query
  let _select
  if (typeof fields === 'string')
    _select = processSelect(fields)

  const conspect = await prisma.conspect.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      body: true,
      chapterId: true,
      createdAt: true,
      updatedAt: true,
      practiceId: true,
      practice: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })
  res.json(conspect)
}

export async function createConspect(req: Request, res: Response) {
  const { title, body, chapterId, practiceId } = req.body

  const data = {
    title,
    body,
    chapterId: chapterId ? Number(chapterId) : 1,
    practiceId: practiceId ? Number(practiceId) : undefined,
  }
  const conspect = await prisma.conspect.create({ data })
  res.json(conspect)
}

export async function editConspect(req: Request, res: Response) {
  const { title, body, chapterId, practiceId } = req.body
  const data: {
    title: string
    body: string
    chapterId: number
    practiceId: number | null
  } = {
    title: '',
    body: '',
    chapterId: 1,
    practiceId: null,
  }

  if (title)
    data.title = title
  if (body)
    data.body = body

  data.chapterId = chapterId ? Number(chapterId) : 1
  data.practiceId = practiceId ? Number(practiceId) : null

  const id = Number(req.params.id)
  const conspect = await prisma.conspect.update({
    where: { id },
    data,
  })
  res.json(conspect)
}

export async function deleteConspect(req: Request, res: Response) {
  const id = Number(req.params.id)
  const conspect = await prisma.conspect.delete({
    where: { id },
  })
  res.json(conspect)
}
