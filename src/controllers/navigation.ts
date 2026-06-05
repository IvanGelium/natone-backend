import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'

export async function getNavigation(_req: Request, res: Response) {
  const navigation = await prisma.stage.findMany({
    orderBy: {
      orderIndex: 'asc',
    },
    select: {
      id: true,
      title: true,
      orderIndex: true,
      chapters: {
        orderBy: {
          orderIndex: 'asc',
        },
        select: {
          id: true,
          title: true,
          orderIndex: true,
          conspects: {
            orderBy: {
              orderIndex: 'asc',
            },
            select: {
              id: true,
              title: true,
              orderIndex: true,
            },
          },
        },
      },
    },
  })
  res.json({ stages: navigation })
}

export async function setNavigationOrder(req: Request, res: Response) {
  const entities = ['chapter', 'stage', 'conspect'] as const
  const { entity } = req.params

  const isValidEntity = (e: string): e is typeof entities[number] => entities.includes(e as any)

  const orderedEntities = req.body || []
  if (!isValidEntity(entity) || !orderedEntities.length) {
    return res.status(400).send('Не удалось обновить порядок, не хватает данных.')
  }

  try {
    const queries = orderedEntities.map((item: { id: number | string, orderIndex: number }) => {
      const id = Number(item.id)
      const orderIndex = Number(item.orderIndex)
      console.log('id:', id, 'order:', orderIndex)
      return (prisma as any)[entity].update({
        where: { id },
        data: { orderIndex },
      })
    })
    prisma.$transaction(queries)
    res.json({ success: true })
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to reorder' })
  }
}
