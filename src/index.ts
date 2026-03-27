import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const app = express();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.get('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
