import mongoose from "mongoose";
import Suara from "../models/suara";
import connect from "../lib/databaseconnect";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const mockData = [
  {
    nama: "Kandidat 1",
    nomor: "01",
    count: "0",
  },
  {
    nama: "Kandidat 2",
    nomor: "02",
    count: "0",
  },
  {
    nama: "Kandidat 3",
    nomor: "03",
    count: "0",
  },
  {
    nama: "tidaksah",
    nomor: "null",
    count: "0",
  },
];

async function generateSuara() {
  try {
    console.log("Connecting to the database...");
    await connect();

    console.log("Clearing existing Suara data...");
    await Suara.deleteMany({});

    console.log("Seeding new Suara data...");
    await Suara.insertMany(mockData);

    console.log("Successfully generated Suara data!");
  } catch (error) {
    console.error("Error generating Suara data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
    process.exit(0);
  }
}

generateSuara();
