import db from "#db/client";
import { faker }from "@faker-js/faker";
import { createEmployee } from "#db/queries/employees";
await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

async function seedEmployees() {
  // TODO
    for (let i = 0 ; i < 10 ; i++){
    const employee ={
      name: faker.music.artist(),
     birthday: faker.date.past(),
      salary: faker.number.int({min: 10 , max: 100}),
    }
    await createEmployee(employee);
  }
}
