import { create } from 'zustand';

export interface AnswerRecord {
  moduleId: string;
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  hintsUsed: number;
  timestamp: number;
}

interface GameState {
  studentId: string | null;
  sessionId: string;
  answers: AnswerRecord[];
  currentModule: string | null;
  
  setStudentId: (id: string) => void;
  setCurrentModule: (id: string | null) => void;
  recordAnswer: (record: AnswerRecord) => void;
  getModuleAnswer: (moduleId: string) => AnswerRecord | undefined;
  getCorrectCount: () => number;
  getWrongCount: () => number;
  getAccuracy: () => number;
  getTotalHintsUsed: () => number;
  getTopicCompletion: () => Record<string, number>;
  exportPayload: () => object;
  reset: () => void;
}

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useGameStore = create<GameState>((set, get) => ({
  studentId: null,
  sessionId: generateSessionId(),
  answers: [],
  currentModule: null,

  setStudentId: (id) => set({ studentId: id }),
  setCurrentModule: (id) => set({ currentModule: id }),
  
  recordAnswer: (record) => set((state) => ({
    answers: [...state.answers.filter(a => a.moduleId !== record.moduleId), record],
  })),

  getModuleAnswer: (moduleId) => get().answers.find(a => a.moduleId === moduleId),

  getCorrectCount: () => get().answers.filter(a => a.correct).length,
  getWrongCount: () => get().answers.filter(a => !a.correct).length,
  getAccuracy: () => {
    const answers = get().answers;
    if (answers.length === 0) return 0;
    return Math.round((answers.filter(a => a.correct).length / answers.length) * 100);
  },
  getTotalHintsUsed: () => get().answers.reduce((sum, a) => sum + a.hintsUsed, 0),

  getTopicCompletion: () => {
    const answers = get().answers;
    const modules = ['polygons', 'exterior-angles', 'parallelograms', 'rhombus', 'angle-sum', 'kite', 'rectangle', 'square-identity'];
    const result: Record<string, number> = {};
    modules.forEach(m => {
      const answer = answers.find(a => a.moduleId === m);
      result[m] = answer ? (answer.correct ? 100 : 40) : 0;
    });
    return result;
  },

  exportPayload: () => {
    const state = get();
    return {
      student_id: state.studentId ?? null,
      session_id: state.sessionId,
      timestamp: new Date().toISOString(),
      total_questions: 24,
      correct_answers: state.getCorrectCount(),
      wrong_answers: state.getWrongCount(),
      hints_used: state.getTotalHintsUsed(),
      topic_completion_ratio: state.getTopicCompletion(),
    };
  },

  reset: () => set({ studentId: null, sessionId: generateSessionId(), answers: [], currentModule: null }),
}));
