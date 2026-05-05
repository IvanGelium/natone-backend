import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { processSelect } from '@/utils/utils'

export async function getStage(req: Request, res: Response) {
  // const { fields } = req.query
  // let select
  // if (typeof fields === 'string')
  //   select = processSelect(fields)
  const items = await prisma.stage.findMany({
    select: {
      id: true,
      title: true,
    },
  })
  res.json(items)
}

export async function getStageById(req: Request, res: Response) {
  const { fields } = req.query
  const id = Number(req.params.id)
  let select
  if (typeof fields === 'string')
    select = processSelect(fields)

  const conspect = await prisma.stage.findUnique({
    where: {
      id,
    },
    select,
  })
  res.json(conspect)
}

export async function createStage(req: Request, res: Response) {
  const stage = await prisma.stage.create({ data: req.body })
  res.json(stage)
}

export async function editStage(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { title } = req.body
  const stage = await prisma.stage.update({
    where: { id },
    data: {
      title,
    },
  })
  res.json(stage)
}

export async function deleteStage(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (id === 1) {
    return res.status(400).json('Нельзя удалить стандартный этап')
  }
  const stage = await prisma.stage.delete({
    where: { id },
  })
  res.json(stage)
}
