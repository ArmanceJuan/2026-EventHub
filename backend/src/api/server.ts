import app from "./app";
import { initializeMongoose } from "./config/mongoose.config";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await initializeMongoose();

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

startServer().then(() => console.log("✅ Server started"));
