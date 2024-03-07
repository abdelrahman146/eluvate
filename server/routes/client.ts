// routes/clients.ts
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, authorize } from "../middleware";

const prisma = new PrismaClient();
const router = express.Router();

// Get list of clients with optional pagination
router.get("/", authenticate, authorize, async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const { include = {} as any, select = {} as any } = req.query;
  const clients = await prisma.client.findMany({
    take: +pageSize,
    skip: +offset,
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  res.json(clients);
});

// Get one client by ID
router.get("/:id", authenticate, authorize, async (req: Request, res: Response) => {
  const clientId = parseInt(req.params.id);
  const { include = {} as any, select = {} as any } = req.query;
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: "Client not found" });
  }
});

// Create a new client (requires 'editor' role)
router.post("/", authenticate, authorize, async (req: Request, res: Response) => {
  const newClientData = req.body;
  const createdClient = await prisma.client.create({
    data: newClientData,
  });

  res.status(201).json(createdClient);
});

// Update a client by ID (requires 'editor' role)
router.put("/:id", authenticate, authorize, async (req: Request, res: Response) => {
  const clientId = parseInt(req.params.id);
  const updatedClientData = req.body;
  const updatedClient = await prisma.client.update({
    where: { id: clientId },
    data: updatedClientData,
  });

  res.json(updatedClient);
});

// Delete a client by ID (requires 'editor' role)
router.delete("/:id", authenticate, authorize, async (req: Request, res: Response) => {
  const clientId = parseInt(req.params.id);
  await prisma.client.delete({
    where: { id: clientId },
  });

  res.status(204).send();
});

export default router;
