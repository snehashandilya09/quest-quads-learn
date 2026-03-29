import { create } from 'zustand';

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
  masteryScores: {},
  errorCount: 0,
  showRemedial: false,

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
    masteryScores: {},
    errorCount: 0,
    showRemedial: false,
  }),
}));
