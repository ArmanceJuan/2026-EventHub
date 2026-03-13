import mongoose from "mongoose";

export async function initializeMongoose(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI n'est pas défini dans les variables d'env");
  }
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connecté");
  } catch (error) {
    console.log("Erreur lors de la connexion MongoDB: ", error);
  }
}
