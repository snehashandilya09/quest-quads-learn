import mongoose from "mongoose";

const bktSchema = new mongoose.Schema(
  {
    polygon_angle_sum: { type: Number, default: 0.1 },
    parallelogram_opposite_sides: { type: Number, default: 0.1 },
    parallelogram_adjacent_angles: { type: Number, default: 0.1 },
    hierarchical_classification_square_rectangle: { type: Number, default: 0.1 },
  },
  { _id: false }
);

const learnerSchema = new mongoose.Schema(
  {
    student_identification: {
      learner_id: { type: String, required: true, unique: true },
      curriculum_alignment: {
        type: String,
        default: "NCERT_Class_8_Math",
      },
      current_chapter: {
        type: String,
        default: "Understanding_Quadrilaterals",
      },
    },
    cognitive_profiling: {
      current_van_hiele_level: { type: Number, default: 0 },
      van_hiele_state_description: {
        type: String,
        default: "Level 0: Visualization",
      },
      bkt_mastery_probabilities: { type: bktSchema, default: () => ({}) },
    },
    domain_knowledge_tracing: {
      active_constraint_violations: { type: [String], default: [] },
    },
    pedagogical_interaction_history: {
      hint_utilization_rate: { type: Number, default: 0 },
      preferred_scaffold_type: { type: String, default: "none" },
      consecutive_errors_current_node: { type: Number, default: 0 },
      total_questions_encountered: { type: Number, default: 0 },
      first_try_corrects: { type: Number, default: 0 },
      total_correct: { type: Number, default: 0 },
      total_wrong: { type: Number, default: 0 },
      total_hints_used: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Learner", learnerSchema);
