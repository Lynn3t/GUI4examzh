import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exam, ExamInfo, Question, ExamMaterial, ExamPoem, ExamSection, ExamSetupConfig, ExamContent, ExamNote } from '@/types/exam'
import { normalizeExam } from '@/types/exam'

interface ExamState {
  exam: Exam
  selectedQuestionId: string | null
  selectedIds: string[]
  isSortingMode: boolean
  history: Exam[]
  historyIndex: number
  actions: {
    setExamInfo: (info: Partial<ExamInfo>) => void
    addQuestion: (question: Question) => void
    updateQuestion: (id: string, updates: Partial<Question>) => void
    deleteQuestion: (id: string) => void
    selectQuestion: (id: string | null) => void
    moveQuestion: (fromIndex: number, toIndex: number) => void
    moveSelectedTo: (targetIndex: number) => void
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
    addSection: (section: ExamSection) => void
    updateSection: (id: string, updates: Partial<ExamSection>) => void
    deleteSection: (id: string) => void
    addNote: (note: ExamNote) => void
    updateNote: (id: string, updates: Partial<ExamNote>) => void
    deleteNote: (id: string) => void
    setExamSetup: (setup: Partial<ExamSetupConfig>) => void
    toggleSelectId: (id: string) => void
    selectAll: () => void
    clearSelection: () => void
    batchDelete: () => void
    setSortingMode: (mode: boolean) => void
  }
}

const generateId = () => Math.random().toString(36).substring(2, 11)

const defaultExamSetup: ExamSetupConfig = {
  page: { size: 'a4paper', showHead: true, showFoot: true, footContent: '试卷第 ; 页，共 ; 页' },
  title: { titleFormat: '\\huge\\bfseries', subjectFormat: '\\Large\\bfseries' },
  question: { showPoints: 'auto' },
  choices: { labelSep: '0.5em' },
  paren: { showParen: true, type: 'hfill' },
  solution: { showSolution: 'show-move', preAnalysis: [], scoreShowleader: true },
  extraGroups: {},
  extraRaw: '',
}

const createEmptyExam = (): Exam => normalizeExam({
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
        { key: 'studentId', label: '考号', width: 8 },
      ],
    },
  },
  examSetup: { ...defaultExamSetup },
  contents: [],
})

const initialState = createEmptyExam()
const MAX_HISTORY = 50

function commitExam(exam: Exam, set: (fn: (state: any) => any) => void, extra: Record<string, unknown> = {}) {
  const normalizedExam = normalizeExam(exam)
  set((state: any) => ({
    ...extra,
    exam: normalizedExam,
    history: pushHistory(state.history, state.historyIndex, normalizedExam),
    historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY - 1, pushHistory(state.history, state.historyIndex, normalizedExam).length - 1),
  }))
}

function pushHistory(history: Exam[], historyIndex: number, exam: Exam) {
  const next = history.slice(0, historyIndex + 1)
  next.push(exam)
  if (next.length > MAX_HISTORY) {
    next.shift()
  }
  return next
}

function updateContent<T extends ExamContent>(contents: ExamContent[], id: string, updates: Partial<T>) {
  return contents.map((item) => (item.id === id ? { ...item, ...updates } : item))
}

function deleteContent(contents: ExamContent[], id: string) {
  return contents.filter((item) => item.id !== id)
}

const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      exam: initialState,
      selectedQuestionId: null,
      selectedIds: [],
      isSortingMode: true,
      history: [initialState],
      historyIndex: 0,
      actions: {
        setExamInfo: (updates) => {
          commitExam({ ...get().exam, info: { ...get().exam.info, ...updates } }, set)
        },
        addQuestion: (question) => {
          commitExam({ ...get().exam, contents: [...get().exam.contents, question] }, set)
        },
        updateQuestion: (id, updates) => {
          commitExam({ ...get().exam, contents: updateContent(get().exam.contents, id, updates) }, set)
        },
        deleteQuestion: (id) => {
          commitExam(
            { ...get().exam, contents: deleteContent(get().exam.contents, id) },
            set,
            { selectedQuestionId: get().selectedQuestionId === id ? null : get().selectedQuestionId }
          )
        },
        selectQuestion: (id) => set({ selectedQuestionId: id }),
        moveQuestion: (fromIndex, toIndex) => {
          const contents = [...get().exam.contents]
          const [removed] = contents.splice(fromIndex, 1)
          contents.splice(toIndex, 0, removed)
          commitExam({ ...get().exam, contents }, set)
        },
        moveSelectedTo: (targetIndex) => {
          const { exam, selectedIds } = get()
          if (selectedIds.length === 0) return
          const selectedSet = new Set(selectedIds)
          const moving = exam.contents.filter((item) => selectedSet.has(item.id))
          const staying = exam.contents.filter((item) => !selectedSet.has(item.id))
          const safeIndex = Math.max(0, Math.min(targetIndex, staying.length))
          staying.splice(safeIndex, 0, ...moving)
          commitExam({ ...exam, contents: staying }, set)
        },
        generateId,
        undo: () => {
          const { history, historyIndex } = get()
          if (historyIndex > 0) {
            set({ exam: history[historyIndex - 1], historyIndex: historyIndex - 1 })
          }
        },
        redo: () => {
          const { history, historyIndex } = get()
          if (historyIndex < history.length - 1) {
            set({ exam: history[historyIndex + 1], historyIndex: historyIndex + 1 })
          }
        },
        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,
        importExam: (newExam) => {
          const normalizedExam = normalizeExam(newExam)
          set({
            exam: normalizedExam,
            selectedQuestionId: null,
            selectedIds: [],
            isSortingMode: true,
            history: [normalizedExam],
            historyIndex: 0,
          })
        },
        clearExam: () => {
          const emptyExam = createEmptyExam()
          set({
            exam: emptyExam,
            selectedQuestionId: null,
            selectedIds: [],
            isSortingMode: true,
            history: [emptyExam],
            historyIndex: 0,
          })
        },
        addMaterial: (material) => {
          commitExam({ ...get().exam, contents: [...get().exam.contents, material] }, set)
        },
        updateMaterial: (id, updates) => {
          commitExam({ ...get().exam, contents: updateContent(get().exam.contents, id, updates) }, set)
        },
        deleteMaterial: (id) => {
          commitExam({ ...get().exam, contents: deleteContent(get().exam.contents, id) }, set)
        },
        addPoem: (poem) => {
          commitExam({ ...get().exam, contents: [...get().exam.contents, poem] }, set)
        },
        updatePoem: (id, updates) => {
          commitExam({ ...get().exam, contents: updateContent(get().exam.contents, id, updates) }, set)
        },
        deletePoem: (id) => {
          commitExam({ ...get().exam, contents: deleteContent(get().exam.contents, id) }, set)
        },
        addSection: (section) => {
          commitExam({ ...get().exam, contents: [...get().exam.contents, section] }, set)
        },
        updateSection: (id, updates) => {
          commitExam({ ...get().exam, contents: updateContent(get().exam.contents, id, updates) }, set)
        },
        deleteSection: (id) => {
          commitExam({ ...get().exam, contents: deleteContent(get().exam.contents, id) }, set)
        },
        addNote: (note) => {
          commitExam({ ...get().exam, contents: [...get().exam.contents, note] }, set)
        },
        updateNote: (id, updates) => {
          commitExam({ ...get().exam, contents: updateContent(get().exam.contents, id, updates) }, set)
        },
        deleteNote: (id) => {
          commitExam({ ...get().exam, contents: deleteContent(get().exam.contents, id) }, set)
        },
        setExamSetup: (setup) => {
          commitExam(
            {
              ...get().exam,
              examSetup: {
                ...get().exam.examSetup,
                ...setup,
                page: { ...get().exam.examSetup.page, ...setup.page },
                title: { ...get().exam.examSetup.title, ...setup.title },
                question: { ...get().exam.examSetup.question, ...setup.question },
                choices: { ...get().exam.examSetup.choices, ...setup.choices },
                paren: { ...get().exam.examSetup.paren, ...setup.paren },
                solution: { ...get().exam.examSetup.solution, ...setup.solution },
                extraGroups: { ...get().exam.examSetup.extraGroups, ...setup.extraGroups },
                extraRaw: typeof setup.extraRaw === 'undefined' ? get().exam.examSetup.extraRaw : setup.extraRaw,
              },
            },
            set
          )
        },
        toggleSelectId: (id) => {
          const { selectedIds } = get()
          set({
            selectedIds: selectedIds.includes(id)
              ? selectedIds.filter((sid) => sid !== id)
              : [...selectedIds, id],
          })
        },
        selectAll: () => {
          set({ selectedIds: get().exam.contents.map((item) => item.id) })
        },
        clearSelection: () => set({ selectedIds: [] }),
        batchDelete: () => {
          const { exam, selectedIds } = get()
          const idSet = new Set(selectedIds)
          const currentSelectedId = get().selectedQuestionId
          commitExam(
            { ...exam, contents: exam.contents.filter((item) => !idSet.has(item.id)) },
            set,
            {
              selectedIds: [],
              selectedQuestionId:
                currentSelectedId && idSet.has(currentSelectedId)
                  ? null
                  : currentSelectedId,
            }
          )
        },
        setSortingMode: (mode) => set({ isSortingMode: mode }),
      },
    }),
    {
      name: 'exam-zh-editor-storage',
      partialize: (state) => ({
        exam: state.exam,
        selectedQuestionId: state.selectedQuestionId,
        history: state.history,
        historyIndex: state.historyIndex,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.exam = normalizeExam(state.exam || createEmptyExam())
        state.exam.examSetup = {
          ...defaultExamSetup,
          ...state.exam.examSetup,
          page: { ...defaultExamSetup.page, ...state.exam.examSetup?.page },
          title: { ...defaultExamSetup.title, ...state.exam.examSetup?.title },
          question: { ...defaultExamSetup.question, ...state.exam.examSetup?.question },
          choices: { ...defaultExamSetup.choices, ...state.exam.examSetup?.choices },
          paren: { ...defaultExamSetup.paren, ...state.exam.examSetup?.paren },
          solution: { ...defaultExamSetup.solution, ...state.exam.examSetup?.solution },
          extraGroups: { ...defaultExamSetup.extraGroups, ...state.exam.examSetup?.extraGroups },
        }
        if (state.exam.examSetup.extraRaw && !state.exam.examSetup.extraGroups?.['其他参数']) {
          state.exam.examSetup.extraGroups = {
            ...state.exam.examSetup.extraGroups,
            其他参数: state.exam.examSetup.extraRaw,
          }
        }
        if (typeof state.selectedQuestionId === 'undefined') {
          state.selectedQuestionId = null
        }
        if (!Array.isArray(state.history) || state.history.length === 0) {
          state.history = [state.exam]
          state.historyIndex = 0
        } else {
          state.history = state.history.map((item) => normalizeExam(item))
        }
        if (typeof state.historyIndex !== 'number') {
          state.historyIndex = state.history.length - 1
        }
      },
    }
  )
)

export { useExamStore }
