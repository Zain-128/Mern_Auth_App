import mongoose from "mongoose";

export const ConnectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo Connected Successfully !`);
  } catch (err) {
    console.log(`Mongo Error : ${err}`);
    process.exit(1);
  }
};
