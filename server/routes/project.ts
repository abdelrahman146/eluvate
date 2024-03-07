
// routes/projects.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware';

const prisma = new PrismaClient();
const router = express.Router();

// Get list of projects with optional pagination
router.get('/projects', authenticate, authorize, async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const { include = {} as any, select = {} as any } = req.query;
  const projects = await prisma.project.findMany({
    take: +pageSize,
    skip: +offset,
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  res.json(projects);
});

// Get one project by ID
router.get('/projects/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id);
  const { include = {} as any, select = {} as any } = req.query;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Create a new project (requires 'editor' role)
router.post('/projects', authenticate, authorize, async (req: Request, res: Response) => {
  const newProjectData = req.body;
  const createdProject = await prisma.project.create({
    data: newProjectData,
  });

  res.status(201).json(createdProject);
});

// Update a project by ID (requires 'editor' role)
router.put('/projects/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id);
  const updatedProjectData = req.body;
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: updatedProjectData,
  });

  res.json(updatedProject);
});

// Delete a project by ID (requires 'editor' role)
router.delete('/projects/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id);
  await prisma.project.delete({
    where: { id: projectId },
  });

  res.status(204).send();
});

export default router;
