
// routes/invoices.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware';

const prisma = new PrismaClient();
const router = express.Router();

// Get list of invoices with optional pagination
router.get('/invoices', authenticate, authorize, async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const { include = {} as any, select = {} as any } = req.query;
  const invoices = await prisma.invoice.findMany({
    take: +pageSize,
    skip: +offset,
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  res.json(invoices);
});

// Get one invoice by ID
router.get('/invoices/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.id);
  const { include = {} as any, select = {} as any } = req.query;
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

// Create a new invoice (requires 'editor' role)
router.post('/invoices', authenticate, authorize, async (req: Request, res: Response) => {
  const newInvoiceData = req.body;
  const createdInvoice = await prisma.invoice.create({
    data: newInvoiceData,
  });

  res.status(201).json(createdInvoice);
});

// Update a invoice by ID (requires 'editor' role)
router.put('/invoices/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.id);
  const updatedInvoiceData = req.body;
  const updatedInvoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: updatedInvoiceData,
  });

  res.json(updatedInvoice);
});

// Delete a invoice by ID (requires 'editor' role)
router.delete('/invoices/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.id);
  await prisma.invoice.delete({
    where: { id: invoiceId },
  });

  res.status(204).send();
});

export default router;
