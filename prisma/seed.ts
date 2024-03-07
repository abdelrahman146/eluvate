import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { getRandomInteger } from "../lib/utils/number.utils";
import { hashPassword } from "../lib/utils/auth.utils";

const prisma = new PrismaClient();

let clientId = 1;
let projectId = 1;
let invoiceId = 1;

async function createClients() {
  const max = getRandomInteger(3, 50);

  for (let i = 0; i < max; i++) {
    const client = await prisma.client.create({
      data: {
        client_name: faker.person.fullName(),
        contact_info: faker.location.streetAddress(),
        id: clientId++,
      },
    });
    createProjects(client.id);
  }
}

async function createProjects(clientId: number) {
  const max = getRandomInteger(3, 10);

  for (let i = 0; i < max; i++) {
    const project = await prisma.project.create({
      data: {
        clientId: clientId,
        project_name: faker.lorem.words(),
        id: projectId++,
      },
    });
    createInvoices(project.id);
  }
}

async function createInvoices(projectId: number) {
  const max = getRandomInteger(3, 5);

  for (let i = 0; i < max; i++) {
    await prisma.invoice.create({
      data: {
        projectId: projectId,
        invoice_number: faker.internet.password(),
        id: invoiceId++,
      },
    });
  }
}

async function createAdmin() {
  await prisma.role.create({
    data: {
      id: "admin",
      name: "Admin",
    },
  });
  const password = await hashPassword("123");
  await prisma.user.create({
    data: {
      email: "admin@local.com",
      first_name: "admin",
      last_name: "admin",
      password: password,
      roleId: "admin",
      email_verified: true,
      provider: "LOCAL",
    },
  });
}

createAdmin().then(() => {
  createClients();
});
