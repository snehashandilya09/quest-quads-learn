import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MongoMemoryServer } from "mongodb-memory-server";
import learnerRoutes from "./routes/learnerRoutes.js";
import Learner from "./models/Learner.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(learnerRoutes);

const startServer = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log("✅ In-Memory MongoDB connected!");

    const demoLearnerId = "23B0345";
    const existingDemo = await Learner.findOne({
      "student_identification.learner_id": demoLearnerId,
    });

    if (!existingDemo) {
      await Learner.create({
        student_identification: { learner_id: demoLearnerId },
        cognitive_profiling: {
          bkt_mastery_probabilities: {
            polygon_angle_sum: 0.95,
            parallelogram_opposite_sides: 0.88,
            parallelogram_adjacent_angles: 0.92,
          },
        },
        pedagogical_interaction_history: {
          consecutive_errors_current_node: 0,
        },
      });
      console.log("🌱 Auto-seeded demo data for Roll Number 23B0345");
    }

    app.listen(5000, () => {
      console.log("🚀 Backend server running on port 5000...");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
