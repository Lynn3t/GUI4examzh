import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exam, ExamInfo, Question } from '@/types/exam'

interface ExamState {
  exam: Exam
  selectedQuestionId: string | null
  actions: {
    setExamInfo: (info: Partial<ExamInfo>) => void
    addQuestion: (question: Question) => void
    updateQuestion: (id: string, updates: Partial<Question>) => void
    deleteQuestion: (id: string) => void
    selectQuestion: (id: string | null) => void
    moveQuestion: (fromIndex: number, toIndex: number) => void
    generateId: () => string
  }
}

const generateId = () => Math.random().toString(36).substring(2, 11)

const initialState: Exam = {
  id: generateId(),
  info: {
    title: '未命名试卷',
    subject: '',
    examTime: '',
    totalPoints: 0,
    information: {
      name: '姓名',
      class: '班级',
      studentId: '学号',
    },
  },
  questions: [],
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      exam: initialState,
      selectedQuestionId: null,
      actions: {
        setExamInfo: (updates) =>
          set((state) => ({
            exam: {
              ...state.exam,
              info: { ...state.exam.info, ...updates },
            },
          })),
        addQuestion: (question) =>
          set((state) => ({
            exam: {
              ...state.exam,
              questions: [...state.exam.questions, question],
            },
          })),
        updateQuestion: (id, updates) =>
          set((state) => ({
            exam: {
              ...state.exam,
              questions: state.exam.questions.map((q) =>
                q.id === id ? { ...q, ...updates } : q
              ),
            },
          })),
        deleteQuestion: (id) =>
          set((state) => ({
            exam: {
              ...state.exam,
              questions: state.exam.questions.filter((q) => q.id !== id),
            },
            selectedQuestionId:
              state.selectedQuestionId === id ? null : state.selectedQuestionId,
          })),
        selectQuestion: (id) =>
          set({ selectedQuestionId: id }),
        moveQuestion: (fromIndex, toIndex) =>
          set((state) => {
            const questions = [...state.exam.questions]
            const [removed] = questions.splice(fromIndex, 1)
            questions.splice(toIndex, 0, removed)
            return {
              exam: {
                ...state.exam,
                questions,
              },
            }
          }),
        generateId,
      },
    }),
    {
      name: 'exam-zh-editor-storage',
    }
  )
)
