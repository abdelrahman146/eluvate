export default {
  format_schema: () => `"yarn prisma format`,
  prisma_migrate: (name: string) => `yarn prisma migrate dev --name ${name}`,
  format_code: () => `yarn format`,
};
