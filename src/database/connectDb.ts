import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log("Connected to MongoDB 🤘");
  } catch (error) {
    console.error(error);
    // process.exit(1);
  }
};
