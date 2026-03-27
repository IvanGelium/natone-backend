const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/items", async (req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.get("/items/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
