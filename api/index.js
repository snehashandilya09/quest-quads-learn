import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MongoMemoryServer } from "mongodb-memory-server";
import learnerRoutes from "../routes/learnerRoutes.js";
import Learner from "../models/Learner.js";

const app = express();

// Use CORS for cross-origin requests
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api", learnerRoutes);

let isConnected = false;
let mongoServer = null;

const connectDB = async () => {
    if (isConnected) return;

    try {
        // Start an in-memory server if not already started
        if (!mongoServer) {
            mongoServer = await MongoMemoryServer.create();
        }
        const mongoUri = mongoServer.getUri();

        // Connect Mongoose to the in-memory server
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = true;
        console.log("✅ In-Memory MongoDB connected for Vercel Serverless!");

        // Auto-seed for roll number 23B0345
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
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
};

// Vercel Serverless Function Handler
export default async (req, res) => {
    await connectDB();
    return app(req, res);
};
