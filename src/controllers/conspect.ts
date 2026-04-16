import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { processSelect } from '@/utils/utils'

export async function getConspects(req: Request, res: Response) {
  const { fields } = req.query
  let select
  if (typeof fields === 'string')
    select = processSelect(fields)
  const items = await prisma.conspect.findMany({ select })
  res.json(items)
}

export async function getConspectById(req: Request, res: Response) {
  const { fields } = req.query
  const id = Number(req.params.id)
  let select
  if (typeof fields === 'string')
    select = processSelect(fields)

  const conspect = await prisma.conspect.findUnique({
    where: {
      id,
    },
    select,
  })
  res.json(conspect)
}

export async function createConspect(req: Request, res: Response) {
  const conspect = await prisma.conspect.create({ data: req.body })
  res.json(conspect)
}

export async function editConspect(req: Request, res: Response) {
  const id = Number(req.params.id)
  const data = { data: req.body }
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
