import { run } from "../utils/cmd.utils";
import commands from "../scripts/commands";
import generateSchema from "../scripts/generate-schema";
import generateServer from "../scripts/generate-server";

// create schema
generateSchema();
// format schema
run(commands.format_schema());
// migrate schema
run(commands.prisma_migrate("init"));
// generate server
generateServer();
// format code
run(commands.format_code());
// generate portal
