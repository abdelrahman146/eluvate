import { run } from "../utils/cmd.utils";
import commands from "../scripts/commands";
import generateSchema from "../scripts/generate-schema";

generateSchema();
run(commands.format_schema());
// migrate schema
run(commands.prisma_migrate("init"));
