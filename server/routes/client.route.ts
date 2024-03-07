// routes/clients.ts
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, authorize } from "../middleware";
import type {
  CreateParams,
  CreateResult,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  RaRecord,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from "react-admin";
import { crudService } from "../services/crud.service";
const router = express.Router();
const entity = "client";

router.get("/", authenticate, authorize, async (req: Request, res: Response): Promise<GetListResult> => {
  const params = req.body as GetListParams;
  return crudService.getList(entity, params);
});
