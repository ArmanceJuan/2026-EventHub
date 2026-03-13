import app from "./app";
import container from "./config/dependency-injection";
import { initializeMongoose } from "./config/mongoose.config";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await initializeMongoose();
  container.init();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

startServer().then(() => console.log("✅ Server started"));
