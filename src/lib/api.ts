const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type BktScores = Record<string, number>;

export async function syncLearnerState(
  learnerId: string,
  updatedBktScores: BktScores,
  newErrorTag?: string,
  consecutiveErrors?: number,
  stats?: {
    totalQuestionsEncountered?: number;
    firstTryCorrects?: number;
    totalCorrect?: number;
    totalWrong?: number;
    totalHintsUsed?: number;
  }
) {
  try {
    const response = await fetch(
      `${API_BASE}/api/learner/${encodeURIComponent(learnerId)}/update`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updated_bkt_scores: updatedBktScores,
          new_constraint_violation: newErrorTag,
          consecutive_errors_current_node: consecutiveErrors,
          total_questions_encountered: stats?.totalQuestionsEncountered,
          first_try_corrects: stats?.firstTryCorrects,
          total_correct: stats?.totalCorrect,
          total_wrong: stats?.totalWrong,
          total_hints_used: stats?.totalHintsUsed,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Learner sync failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sync learner state", error);
    throw error;
  }
}

export const createLearnerProfile = async (rollNumber: string) => {
  const response = await fetch(`${API_BASE}/api/learner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ learner_id: rollNumber }),
  });

  if (!response.ok) {
    throw new Error("Failed to create profile");
  }

  return await response.json();
};

export const fetchLearnerProfile = async (rollNumber: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/learner/${rollNumber}`);
    if (response.status === 404) {
      const profile = await createLearnerProfile(rollNumber);
      return { profile, isNew: true };
    }
    if (!response.ok) throw new Error("Failed to fetch profile");
    const profile = await response.json();
    return { profile, isNew: false };
  } catch (error) {
    console.error(error);
    return null;
  }
};
