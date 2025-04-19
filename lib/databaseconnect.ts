import mongoose from "mongoose";

const connect = async () => {
  const mongoURI = process.env.MONGODB;
  if (!mongoURI) {
    throw new Error("MongoDB connection string is not defined");
  }
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connect;
