import express from "express";
import Learner from "../models/Learner.js";

const router = express.Router();

router.get("/api/learner/:learner_id", async (req, res) => {
  try {
    const { learner_id } = req.params;

    const learner = await Learner.findOne({ "student_identification.learner_id": learner_id });
    if (!learner) {
      return res.status(404).json({ error: "Learner not found" });
    }

    return res.json(learner);
  } catch (error) {
    res.status(500).json({ error: "Failed to load learner profile" });
  }
});

router.post("/api/learner", async (req, res) => {
  try {
    const { learner_id } = req.body;
    if (!learner_id) {
      return res.status(400).json({ error: "learner_id is required" });
    }

    let learner = await Learner.findOne({ "student_identification.learner_id": learner_id });
    if (!learner) {
      learner = await Learner.create({
        student_identification: { learner_id },
      });
    }

    return res.status(201).json(learner);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create learner profile" });
  }
});

router.put("/api/learner/:learner_id/update", async (req, res) => {
  try {
    const { learner_id } = req.params;
    const {
      updated_bkt_scores,
      new_constraint_violation,
      consecutive_errors_current_node,
      total_questions_encountered,
      first_try_corrects,
      total_correct,
      total_wrong,
      total_hints_used,
    } = req.body;

    const setOps = {};
    if (updated_bkt_scores && typeof updated_bkt_scores === "object") {
      Object.entries(updated_bkt_scores).forEach(([key, value]) => {
        setOps[`cognitive_profiling.bkt_mastery_probabilities.${key}`] = value;
      });
    }

    if (typeof consecutive_errors_current_node === "number") {
      setOps["pedagogical_interaction_history.consecutive_errors_current_node"] =
        consecutive_errors_current_node;
    }

    if (typeof total_questions_encountered === "number") {
      setOps["pedagogical_interaction_history.total_questions_encountered"] =
        total_questions_encountered;
    }

    if (typeof first_try_corrects === "number") {
      setOps["pedagogical_interaction_history.first_try_corrects"] = first_try_corrects;
    }

    if (typeof total_correct === "number") {
      setOps["pedagogical_interaction_history.total_correct"] = total_correct;
    }

    if (typeof total_wrong === "number") {
      setOps["pedagogical_interaction_history.total_wrong"] = total_wrong;
    }

    if (typeof total_hints_used === "number") {
      setOps["pedagogical_interaction_history.total_hints_used"] = total_hints_used;
    }

    const updateDoc = {};
    if (Object.keys(setOps).length > 0) {
      updateDoc.$set = setOps;
    }

    if (new_constraint_violation) {
      updateDoc.$addToSet = {
        "domain_knowledge_tracing.active_constraint_violations": new_constraint_violation,
      };
    }

    const learner = await Learner.findOneAndUpdate(
      { "student_identification.learner_id": learner_id },
      updateDoc,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(learner);
  } catch (error) {
    res.status(500).json({ error: "Failed to update learner profile" });
  }
});

export default router;
