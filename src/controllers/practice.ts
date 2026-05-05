import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { processSelect } from '@/utils/utils'

export async function getPractice(req: Request, res: Response) {
  const items = await prisma.practice.findMany({
    select: {
      id: true,
      title: true
  } })
  res.json(items)
}

export async function getPracticeById(req: Request, res: Response) {
  const { fields } = req.query
  const id = Number(req.params.id)
  let select
  if (typeof fields === 'string')
    select = processSelect(fields)

  const conspect = await prisma.practice.findUnique({
    where: {
      id,
    },
    select,
  })
  res.json(conspect)
}

export async function createPractice(req: Request, res: Response) {
  const practice = await prisma.practice.create({ data: req.body })
  res.json(practice)
}

export async function editPractice(req: Request, res: Response) {
  const id = Number(req.params.id)
  const data = { data: req.body }
  const practice = await prisma.practice.update({
    where: { id },
    data,
  })
  res.json(practice)
}

export async function deletePractice(req: Request, res: Response) {
  const id = Number(req.params.id)
  const practice = await prisma.practice.delete({
    where: { id },
  })
  res.json(practice)
}
