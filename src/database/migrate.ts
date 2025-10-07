import { createTables, dropTables } from "./schema";

const migrate = async (): Promise<void> => {
  try {
    console.log("Starting database migration...");
    await createTables();
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

const reset = async (): Promise<void> => {
  try {
    console.log("Resetting database...");
    await dropTables();
    await createTables();
    console.log("Database reset completed successfully");
  } catch (error) {
    console.error("Database reset failed:", error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === "reset") {
    reset();
  } else {
    migrate();
  }
}

export { migrate, reset };
