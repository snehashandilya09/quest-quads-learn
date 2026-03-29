import { create } from 'zustand';
import { syncLearnerState } from '@/lib/api';

export interface AnswerRecord {
  moduleId: string;
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  hintsUsed: number;
  retryCount: number;
  timestamp: number;
}

interface GameState {
  studentId: string | null;
  sessionId: string;
  answers: AnswerRecord[];
  currentModule: string | null;
  masteryScores: Record<string, number>;
  errorCount: number;
  showRemedial: boolean;
  totalQuestionsEncountered: number;
  firstTryCorrects: number;
  
  setStudentId: (id: string) => void;
  setCurrentModule: (id: string | null) => void;
  recordAnswer: (record: AnswerRecord) => void;
  getModuleAnswers: (moduleId: string) => AnswerRecord[];
  getModuleAnswer: (moduleId: string) => AnswerRecord | undefined;
  getCorrectCount: () => number;
  getWrongCount: () => number;
  getAccuracy: () => number;
  getTotalHintsUsed: () => number;
  getTopicCompletion: () => Record<string, number>;
  handleAnswer: (isCorrect: boolean, hintsUsed: number, moduleId: string) => number;
  submitAnswerAndUpdateProfile: (
    learnerId: string,
    conceptId: string,
    isCorrect: boolean,
    errorTag?: string | null
  ) => Promise<number | null>;
  updateMasteryScore: (conceptId: string, newScore: number) => void;
  recordQuestionAttempt: (isCorrectOnFirstTry: boolean) => void;
  hydrateLearnerProfile: (profile: {
    masteryScores?: Record<string, number>;
    consecutiveErrors?: number;
  }) => void;
  resetQuestionState: () => void;
  passSafetyGate: () => void;
  exportPayload: () => object;
  reset: () => void;
}

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const MODULE_IDS = ['polygons', 'exterior-angles', 'parallelograms', 'rhombus', 'angle-sum', 'kite', 'rectangle', 'square-identity'];

export const useGameStore = create<GameState>((set, get) => ({
  studentId: null,
  sessionId: generateSessionId(),
  answers: [],
  currentModule: null,
  masteryScores: {
    polygon_angle_sum: 0,
    parallelogram_opposite_sides: 0,
    parallelogram_adjacent_angles: 0,
    hierarchical_classification: 0,
  },
  errorCount: 0,
  showRemedial: false,
  totalQuestionsEncountered: 0,
  firstTryCorrects: 0,

  setStudentId: (id) => set({ studentId: id }),
  setCurrentModule: (id) => set({ currentModule: id }),
  
  recordAnswer: (record) => set((state) => {
    // For correct answers, replace any previous record for this question
    // For wrong answers, just update the latest attempt
    const filtered = state.answers.filter(
      a => !(a.moduleId === record.moduleId && a.questionId === record.questionId)
    );
    return { answers: [...filtered, record] };
  }),

  getModuleAnswers: (moduleId) => get().answers.filter(a => a.moduleId === moduleId),
  
  getModuleAnswer: (moduleId) => {
    const answers = get().answers.filter(a => a.moduleId === moduleId);
    return answers[0];
  },

  getCorrectCount: () => get().answers.filter(a => a.correct).length,
  getWrongCount: () => get().answers.filter(a => !a.correct).length,
  getAccuracy: () => {
    const answers = get().answers;
    if (answers.length === 0) return 0;
    const correct = answers.filter(a => a.correct).length;
    return Math.round((correct / answers.length) * 100);
  },
  getTotalHintsUsed: () => get().answers.reduce((sum, a) => sum + a.hintsUsed, 0),

  getTopicCompletion: () => {
    const answers = get().answers;
    const result: Record<string, number> = {};
    MODULE_IDS.forEach(m => {
      const moduleAnswers = answers.filter(a => a.moduleId === m);
      const correctCount = moduleAnswers.filter(a => a.correct).length;
      const totalForModule = moduleAnswers.length;
      if (totalForModule === 0) {
        result[m] = 0;
      } else {
        result[m] = Math.round((correctCount / Math.max(totalForModule, 1)) * 100);
      }
    });
    return result;
  },

  handleAnswer: (isCorrect, hintsUsed, moduleId) => {
    const state = get();
    const currentScore = state.masteryScores[moduleId] ?? 0;

    if (!isCorrect) {
      const nextErrorCount = state.errorCount + 1;
      set({
        errorCount: nextErrorCount,
        showRemedial: nextErrorCount >= 3,
      });
      return currentScore;
    }

    let nextScore = currentScore;
    if (hintsUsed === 0) {
      nextScore = Math.max(currentScore, 0.9);
    } else {
      nextScore = Math.min(1, currentScore + 0.3);
    }

    set({ masteryScores: { ...state.masteryScores, [moduleId]: nextScore } });
    return nextScore;
  },

  submitAnswerAndUpdateProfile: async (learnerId, conceptId, isCorrect, errorTag = null) => {
    const state = get();
    const currentScore = state.masteryScores[conceptId] ?? 0.1;

    const P_G = 0.2;
    const P_S = 0.1;
    const P_T = 0.3;

    const updateBkt = (correct: boolean, prob: number) => {
      if (correct) {
        const pKnownGivenCorrect = (prob * (1 - P_S)) / ((prob * (1 - P_S)) + ((1 - prob) * P_G));
        return pKnownGivenCorrect + (1 - pKnownGivenCorrect) * P_T;
      }

      const pKnownGivenIncorrect = (prob * P_S) / ((prob * P_S) + ((1 - prob) * (1 - P_G)));
      return pKnownGivenIncorrect + (1 - pKnownGivenIncorrect) * P_T;
    };

    let nextScore = currentScore;
    if (conceptId) {
      nextScore = updateBkt(isCorrect, currentScore);
      set({ masteryScores: { ...state.masteryScores, [conceptId]: nextScore } });
    }

    if (!isCorrect) {
      const nextErrorCount = state.errorCount + 1;
      set({
        errorCount: nextErrorCount,
        showRemedial: nextErrorCount >= 3,
      });
    }

    const nextTotalCorrect = isCorrect ? state.getCorrectCount() + 1 : state.getCorrectCount();
    const nextTotalWrong = !isCorrect ? state.getWrongCount() + 1 : state.getWrongCount();
    const nextTotalHints = state.getTotalHintsUsed();

    try {
      await syncLearnerState(
        learnerId,
        conceptId ? { [conceptId]: nextScore } : {},
        errorTag ?? undefined,
        get().errorCount,
        {
          totalQuestionsEncountered: get().totalQuestionsEncountered,
          firstTryCorrects: get().firstTryCorrects,
          totalCorrect: nextTotalCorrect,
          totalWrong: nextTotalWrong,
          totalHintsUsed: nextTotalHints,
        }
      );
    } catch (error) {
      console.error('Learner sync failed', error);
    }

    return conceptId ? nextScore : null;
  },

  updateMasteryScore: (conceptId, newScore) => set((state) => ({
    masteryScores: {
      ...state.masteryScores,
      [conceptId]: newScore,
    },
  })),

  recordQuestionAttempt: (isCorrectOnFirstTry) => set((state) => ({
    totalQuestionsEncountered: state.totalQuestionsEncountered + 1,
    firstTryCorrects: isCorrectOnFirstTry
      ? state.firstTryCorrects + 1
      : state.firstTryCorrects,
  })),

  hydrateLearnerProfile: (profile) => set((state) => {
    const nextMastery = profile.masteryScores
      ? { ...state.masteryScores, ...profile.masteryScores }
      : state.masteryScores;
    const nextErrorCount = profile.consecutiveErrors ?? state.errorCount;

    return {
      masteryScores: nextMastery,
      errorCount: nextErrorCount,
      showRemedial: nextErrorCount >= 3,
    };
  }),

  resetQuestionState: () => set({ errorCount: 0, showRemedial: false }),

  passSafetyGate: () => set({ errorCount: 0, showRemedial: false }),

  exportPayload: () => {
    const state = get();
    return {
      student_id: state.studentId ?? null,
      session_id: state.sessionId,
      timestamp: new Date().toISOString(),
      total_questions: 40,
      correct_answers: state.getCorrectCount(),
      wrong_answers: state.getWrongCount(),
      hints_used: state.getTotalHintsUsed(),
      topic_completion_ratio: state.getTopicCompletion(),
    };
  },

  reset: () => set({
    studentId: null,
    sessionId: generateSessionId(),
    answers: [],
    currentModule: null,
    masteryScores: {
      polygon_angle_sum: 0,
      parallelogram_opposite_sides: 0,
      parallelogram_adjacent_angles: 0,
      hierarchical_classification: 0,
    },
    errorCount: 0,
    showRemedial: false,
    totalQuestionsEncountered: 0,
    firstTryCorrects: 0,
  }),
}));
