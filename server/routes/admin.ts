import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, authorize } from "../middleware";

const prisma = new PrismaClient();
const router = express.Router();
