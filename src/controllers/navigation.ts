import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'

// interface shortStage {
//   id: number
//   title: string
//   chapters: number[]
// }
// interface shortChapter {
//   id: number
//   title: string
//   conspects: number[]
// }

// interface shortConspect {
//   id: number
//   title: string
// }

export async function getNavigation(_req: Request, res: Response) {
  const navigation = await prisma.stage.findMany({
    select: {
      id: true,
      title: true,
      chapters: {
        select: {
          id: true,
          title: true,
          conspects: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  })
  res.json({stages:navigation})
}

// async function constructNavigation() {
//   const stages = await prisma.stage.findMany({ select: {
//     id: true,
//     title: true,
//     chapters: true,
//   },
//   })

//   const chapters = await prisma.chapter.findMany({ select: {
//     id: true,
//     title: true,
//     conspects: true,
//   },
//   })

//   const conspects = await prisma.conspect.findMany({ select: {
//     id: true,
//     title: true,
//   },
//   })

//   const navigation = stages.map(stage => fillStages(stage))

//   function fillStages(stage: shortStage) {
//     const filledChapters = stage.chapters.map(chapterId => fillChapter(chapterId))
//     return {
//       id: stage.id,
//       title: stage.title,
//       chapters: filledChapters,
//     }
//   }

//   function fillChapter(chapterId: number) {
//     const chapter = chapters.find(c => c.id === chapterId)
//     if (!chapter)
//       return null

//     const filledConspects = chapter.conspects.map((conspectId) => {
//       const conspect = conspects.find(c => c.id === conspectId)
//       if (!conspect)
//         return null

//       return conspect
//     })
//     return {
//       id: chapter.id,
//       title: chapter.title,
//       conspects: filledConspects || null,
//     }
//   }

//   return navigation
// }
//
