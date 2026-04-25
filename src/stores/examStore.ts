import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exam, ExamInfo, Question, ExamMaterial, ExamPoem } from '@/types/exam'

interface ExamState {
  exam: Exam
  selectedQuestionId: string | null
  history: Exam[]
  historyIndex: number
  actions: {
    setExamInfo: (info: Partial<ExamInfo>) => void
    addQuestion: (question: Question) => void
    updateQuestion: (id: string, updates: Partial<Question>) => void
    deleteQuestion: (id: string) => void
    selectQuestion: (id: string | null) => void
    moveQuestion: (fromIndex: number, toIndex: number) => void
    generateId: () => string
    undo: () => void
    redo: () => void
    canUndo: () => boolean
    canRedo: () => boolean
    importExam: (exam: Exam) => void
    clearExam: () => void
    addMaterial: (material: ExamMaterial) => void
    updateMaterial: (id: string, updates: Partial<ExamMaterial>) => void
    deleteMaterial: (id: string) => void
    addPoem: (poem: ExamPoem) => void
    updatePoem: (id: string, updates: Partial<ExamPoem>) => void
    deletePoem: (id: string) => void
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
        fields: [
          { key: 'name', label: '姓名', width: 6 },
          { key: 'class', label: '班级', width: 6 },
          { key: 'studentId', label: '学号', width: 4 },
        ],
      },
    },
  materials: [],
  poems: [],
  questions: [],
}

// 保存历史记录的最大数量
const MAX_HISTORY = 50

const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      exam: initialState,
      selectedQuestionId: null,
      history: [initialState],
      historyIndex: 0,
      actions: {
        setExamInfo: (updates) => {
          const newExam = {
            ...get().exam,
            info: { ...get().exam.info, ...updates },
          }
          set({ exam: newExam })
          addToHistory(newExam, set)
        },
        addQuestion: (question) => {
          const newExam = {
            ...get().exam,
            questions: [...get().exam.questions, question],
          }
          set({ exam: newExam })
          addToHistory(newExam, set)
        },
        updateQuestion: (id, updates) => {
          const newExam: Exam = {
            ...get().exam,
            questions: get().exam.questions.map((q) =>
              q.id === id ? { ...q, ...updates } : q
            ) as Question[],
          }
          set(() => ({ exam: newExam }))
          addToHistory(newExam, set)
        },
        deleteQuestion: (id) => {
          const newExam = {
            ...get().exam,
            questions: get().exam.questions.filter((q) => q.id !== id),
          }
          set(() => ({
            exam: newExam,
            selectedQuestionId:
              get().selectedQuestionId === id ? null : get().selectedQuestionId,
          }))
          addToHistory(newExam, set)
        },
        selectQuestion: (id) => set({ selectedQuestionId: id }),
        moveQuestion: (fromIndex, toIndex) => {
          const questions = [...get().exam.questions]
          const [removed] = questions.splice(fromIndex, 1)
          questions.splice(toIndex, 0, removed)
          const newExam = {
            ...get().exam,
            questions,
          }
          set(() => ({ exam: newExam }))
          addToHistory(newExam, set)
        },
        generateId,
        undo: () => {
          const { history, historyIndex } = get()
          if (historyIndex > 0) {
            set({
              exam: history[historyIndex - 1],
              historyIndex: historyIndex - 1,
            })
          }
        },
        redo: () => {
          const { history, historyIndex } = get()
          if (historyIndex < history.length - 1) {
            set({
              exam: history[historyIndex + 1],
              historyIndex: historyIndex + 1,
            })
          }
        },
        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,
        importExam: (newExam: Exam) => {
          set(() => ({
            exam: newExam,
            selectedQuestionId: null,
            history: [newExam],
            historyIndex: 0,
          }))
        },
        clearExam: () => {
          const emptyExam: Exam = {
            id: generateId(),
            info: {
              title: '未命名试卷',
              subject: '',
              examTime: '',
              totalPoints: 0,
              information: {
                fields: [
                  { key: 'name', label: '姓名', width: 6 },
                  { key: 'class', label: '班级', width: 6 },
                  { key: 'studentId', label: '学号', width: 4 },
                ],
              },
            },
            materials: [],
            poems: [],
            questions: [],
          }
          set(() => ({
            exam: emptyExam,
            selectedQuestionId: null,
            history: [emptyExam],
            historyIndex: 0,
          }))
        },
        addMaterial: (material) => {
          const newExam = {
            ...get().exam,
            materials: [...get().exam.materials, material],
          }
          set({ exam: newExam })
          addToHistory(newExam, set)
        },
        updateMaterial: (id, updates) => {
          const newExam = {
            ...get().exam,
            materials: get().exam.materials.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          }
          set(() => ({ exam: newExam }))
          addToHistory(newExam, set)
        },
        deleteMaterial: (id) => {
          const newExam = {
            ...get().exam,
            materials: get().exam.materials.filter((m) => m.id !== id),
          }
          set(() => ({ exam: newExam }))
          addToHistory(newExam, set)
        },
        addPoem: (poem) => {
          const newExam = {
            ...get().exam,
            poems: [...get().exam.poems, poem],
          }
          set({ exam: newExam })
          addToHistory(newExam, set)
        },
        updatePoem: (id, updates) => {
          const newExam = {
            ...get().exam,
            poems: get().exam.poems.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          }
          set(() => ({ exam: newExam }))
          addToHistory(newExam, set)
        },
        deletePoem: (id) => {
          const newExam = {
            ...get().exam,
            poems: get().exam.poems.filter((p) => p.id !== id),
          }
          set(() => ({ exam: newExam }))
          addToHistory(newExam, set)
        },
      },
    }),
    {
      name: 'exam-zh-editor-storage',
    }
  )
)

// 添加历史记录的辅助函数
function addToHistory(newExam: Exam, set: (fn: (state: any) => any) => void) {
  set((state: any) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newExam)
    
    // 限制历史记录数量
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift()
    }
    
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    }
  })
}

export { useExamStore }

