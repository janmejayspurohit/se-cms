/**
 * !DEV SETUP
 * * This file is responsible for initializing dev related DB & Service Configuration
 *
 * !USAGE:
 * yarn dev-init setup # This initializes DB & Service
 *
 * !Help:
 * yarn dev-init help # Lists the possible commands
 *
 * ? Where to run this command?
 * * Run from the root of this API directory
 */
require("dotenv").config({ path: "./.env" });

const { execSync } = require("child_process");

const DB_CONFIG = require("./db/config");
const DATABASE_NAME = DB_CONFIG.database;

const ENUM_ARG_TYPES = {
  help: "help",
  setup: "setup",
};

const SUPPORTED_ARGS = {
  [ENUM_ARG_TYPES["help"]]: "Lists the supported arguments",
  [ENUM_ARG_TYPES["setup"]]: "Drops, creates, migrates and seeds DB",
};

const customExecSync = (cmd) => execSync(cmd, { stdio: "inherit" });

const dropDB = async () => {
  console.log("DELETING DATABASE", DATABASE_NAME);
  await customExecSync(`sequelize-cli db:drop`);
};

const createDB = async () => {
  console.log("CREATING DATABASE", DATABASE_NAME);
  await customExecSync(`sequelize-cli db:create`);
};

const migrateDB = async () => {
  console.log("RUNNING MIGRATIONS");
  await customExecSync(`sequelize-cli db:migrate`);
};

const seedDB = async () => {
  console.log("CLEARING SEEDS");
  await customExecSync(`sequelize-cli db:seed:undo:all`);

  console.log("CREATING SEEDS");
  await customExecSync(`sequelize-cli db:seed:all`);
};

const COMMANDS_TO_INIT_DB = [dropDB, createDB, migrateDB, seedDB];

const divider = () => {
  console.log("<*>".repeat(40));
  console.log("\n");
};

const setup = async () => {
  for (const func of COMMANDS_TO_INIT_DB) {
    await func();
  }
  divider();
};

const help = () => {
  console.log("SUPPORTED ARGS");
  console.log("=================");
  console.log(SUPPORTED_ARGS);
  console.log("=================");
  console.log("EXITING DEV SETUP");
};

const run = async () => {
  const args = process.argv.slice(2);
  let arg1 = args[0];

  if (!arg1) arg1 = ENUM_ARG_TYPES["setup"];

  switch (arg1) {
    case ENUM_ARG_TYPES["help"]:
      help();
      break;
    case ENUM_ARG_TYPES["setup"]:
      await setup();
      break;
  }
};

run();
