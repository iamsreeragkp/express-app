import { CreateUserData } from "../types";
import pool from "./connection";

const seedData = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    // Sample users data
    const sampleUsers: CreateUserData[] = [
      {
        auth0_id: "auth0|507f1f77bcf86cd799439011",
        email: "john.doe@example.com",
        first_name: "John",
        last_name: "Doe",
        profile_picture: "https://via.placeholder.com/150",
        is_active: true,
      },
      {
        auth0_id: "auth0|507f1f77bcf86cd799439012",
        email: "jane.smith@example.com",
        first_name: "Jane",
        last_name: "Smith",
        profile_picture: "https://via.placeholder.com/150",
        is_active: true,
      },
      {
        auth0_id: "auth0|507f1f77bcf86cd799439013",
        email: "bob.johnson@example.com",
        first_name: "Bob",
        last_name: "Johnson",
        profile_picture: "https://via.placeholder.com/150",
        is_active: false,
      },
    ];

    // Insert sample users
    for (const user of sampleUsers) {
      await client.query(
        `
        INSERT INTO users (auth0_id, email, first_name, last_name, profile_picture, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (auth0_id) DO NOTHING
      `,
        [
          user.auth0_id,
          user.email,
          user.first_name,
          user.last_name,
          user.profile_picture,
          user.is_active,
        ]
      );
    }

    console.log("Sample data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedData };
