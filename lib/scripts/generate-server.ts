import * as fs from "fs";
import * as path from "path";
import { readModelFiles } from "../utils/models.utils";
import { capitalizeFirstLetter, pluralize } from "../utils/string.utils";
import { IModel } from "../types/model";

const make_app_template = ({ models }: { models: IModel[] }) => {
  return `
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import type { Request, Response, NextFunction } from 'express';

${models.map(model => `import ${model.name}Router from './routes/${model.name}';`).join("\n")}

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

${models.map(model => `app.use('/${pluralize(model.name)}', ${model.name}Router);`).join("\n")}

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

    `;
};

const make_model_template = ({ model }: { model: string }) => `
// routes/${pluralize(model)}.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware';

const prisma = new PrismaClient();
const router = express.Router();

// Get list of ${pluralize(model)} with optional pagination
router.get('/${pluralize(model)}', authenticate, authorize, async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const { include = {} as any, select = {} as any } = req.query;
  const ${pluralize(model)} = await prisma.${model}.findMany({
    take: +pageSize,
    skip: +offset,
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  res.json(${pluralize(model)});
});

// Get one ${model} by ID
router.get('/${pluralize(model)}/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const ${model}Id = parseInt(req.params.id);
  const { include = {} as any, select = {} as any } = req.query;
  const ${model} = await prisma.${model}.findUnique({
    where: { id: ${model}Id },
    ...(Object.keys(include).length > 0 ? include : {}),
    ...(Object.keys(select).length > 0 ? select : {}),
  });

  if (${model}) {
    res.json(${model});
  } else {
    res.status(404).json({ error: '${capitalizeFirstLetter(model)} not found' });
  }
});

// Create a new ${model} (requires 'editor' role)
router.post('/${pluralize(model)}', authenticate, authorize, async (req: Request, res: Response) => {
  const new${capitalizeFirstLetter(model)}Data = req.body;
  const created${capitalizeFirstLetter(model)} = await prisma.${model}.create({
    data: new${capitalizeFirstLetter(model)}Data,
  });

  res.status(201).json(created${capitalizeFirstLetter(model)});
});

// Update a ${model} by ID (requires 'editor' role)
router.put('/${pluralize(model)}/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const ${model}Id = parseInt(req.params.id);
  const updated${capitalizeFirstLetter(model)}Data = req.body;
  const updated${capitalizeFirstLetter(model)} = await prisma.${model}.update({
    where: { id: ${model}Id },
    data: updated${capitalizeFirstLetter(model)}Data,
  });

  res.json(updated${capitalizeFirstLetter(model)});
});

// Delete a ${model} by ID (requires 'editor' role)
router.delete('/${pluralize(model)}/:id', authenticate, authorize, async (req: Request, res: Response) => {
  const ${model}Id = parseInt(req.params.id);
  await prisma.${model}.delete({
    where: { id: ${model}Id },
  });

  res.status(204).send();
});

export default router;
`;

function createRoute(model: IModel) {
  // write the schema file
  const content = make_model_template({ model: model.name });
  const routePath = path.join(process.cwd(), "server", "routes", `${model.name}.ts`);
  fs.writeFileSync(routePath, content);
}

function createApp(models: IModel[]) {
  const content = make_app_template({ models });
  const routePath = path.join(process.cwd(), "server", `app.ts`);
  fs.writeFileSync(routePath, content);
}

export default function main() {
  if (!fs.existsSync(path.join(process.cwd(), "server/routes"))) {
    try {
      fs.mkdirSync(path.join(process.cwd(), "server/routes"), {
        recursive: true,
      });
      console.log(`Directory created: ${path.join(process.cwd(), "server/routes")}`);
    } catch (err) {
      console.error("Error creating directory:", err);
    }
  }
  // read models
  const models = readModelFiles();
  models.forEach(model => {
    createRoute(model);
  });

  createApp(models);
}
