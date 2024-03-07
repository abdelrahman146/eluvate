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
import { PrismaClient } from "@prisma/client";
import { isPlural } from "../../lib/utils/string.utils";

const prisma = new PrismaClient();

export const adminService = {
  getList: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: GetListParams,
  ): Promise<GetListResult<RecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    const total = await table.count({ where: { ...params.filter } });
    const result = await table.findMany({
      where: { ...params.filter },
      orderBy: { [params.sort.field]: params.sort.order.toLowerCase() },
      take: params.pagination.perPage,
      skip: params.pagination.perPage * (params.pagination.page - 1),
    });
    return { data: result, total };
  },
  getOne: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: GetOneParams<RecordType>,
  ): Promise<GetOneResult<RecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    const result = await table.findFirst({
      where: { id: params.id },
    });
    return { data: result };
  },
  getMany: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: GetManyParams,
  ): Promise<GetManyResult<RecordType>> {
    resource = isPlural(resource);
    console.log(resource);
    const table = prisma[resource as any] as any;
    const result = await table.findMany({
      where: { id: { in: params.ids } },
    });
    return { data: result };
  },
  getManyReference: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: GetManyReferenceParams,
  ): Promise<GetManyReferenceResult<RecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    const total = await table.count({ where: { ...params.filter } });
    const result = await table.findMany({
      where: { [params.target]: params.id, ...params.filter },
      orderBy: { [params.sort.field]: params.sort.order.toLowerCase() },
      take: params.pagination.perPage,
      skip: params.pagination.perPage * (params.pagination.page - 1),
    });
    return { data: result, total };
  },
  update: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: UpdateParams<any>,
  ): Promise<UpdateResult<RecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    const result = await table.update({ where: { id: params.id }, data: { ...params.data } });
    return { data: result };
  },
  updateMany: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: UpdateManyParams<any>,
  ): Promise<UpdateManyResult<RecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    const result = await table.updateMany({
      where: { id: { in: params.ids } },
      data: { ...params.data },
      select: { id: true },
    });
    return { data: result };
  },
  create: async function <
    RecordType extends Omit<RaRecord<Identifier>, "id"> = any,
    ResultRecordType extends RaRecord<Identifier> = RecordType & { id: Identifier },
  >(resource: string, params: CreateParams<any>): Promise<CreateResult<ResultRecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    const result = await table.create({ data: params.data });
    return { data: result };
  },
  delete: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: DeleteParams<RecordType>,
  ): Promise<DeleteResult<RecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    const result = await table.delete({ where: { id: params.id } });
    return { ...result };
  },
  deleteMany: async function <RecordType extends RaRecord<Identifier> = any>(
    resource: string,
    params: DeleteManyParams<RecordType>,
  ): Promise<DeleteManyResult<RecordType>> {
    resource = isPlural(resource);
    const table = prisma[resource as any] as any;
    await table.deleteMany({
      where: { id: { in: params.ids } },
    });
    return { data: [...params.ids] };
  },
};
