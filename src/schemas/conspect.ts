import { z } from 'zod'

export const createConspectSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    content: z.string(),
    path: z.string(),
  }),
})
