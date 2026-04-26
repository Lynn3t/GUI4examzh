// 试卷类型定义

export type QuestionType = 'choice' | 'fillin' | 'problem' | 'judgment' | 'line' | 'calculations' | 'material' | 'poem' | 'writing' | 'select'

export interface ExamInfo {
  title: string
  subject: string
  examTime: string
  totalPoints: number
  information: {
    fields: { key: string; label: string; width?: number }[]
  }
}

export interface ExamSetupPage {
  size?: string
  showHead?: boolean
  showFoot?: boolean
  footContent?: string
}

export interface ExamSetupTitle {
  titleFormat?: string
  subjectFormat?: string
}

export interface ExamSetupQuestion {
  showPoints?: string
}

export interface ExamSetupChoices {
  labelSep?: string
}

export interface ExamSetupParen {
  showParen?: boolean
  type?: string
}

export interface ExamSetupSolution {
  showSolution?: string
  preAnalysis?: string[]
  scoreShowleader?: boolean
}

export interface ExamSetupConfig {
  page?: ExamSetupPage
  title?: ExamSetupTitle
  question?: ExamSetupQuestion
  choices?: ExamSetupChoices
  paren?: ExamSetupParen
  solution?: ExamSetupSolution
}

export interface ExamSection {
  id: string
  type: 'section' | 'subsection'
  title: string
}

export interface ExamNote {
  id: string
  type: 'note'
  content: string
}

export interface ChoiceQuestion {
  id: string
  type: 'choice'
  content: string
  points: number
  answer: string
  options: string[]
  solution?: string
}

export interface FillinQuestion {
  id: string
  type: 'fillin'
  content: string
  points: number
  answer: string
  solution?: string
}

export interface ProblemQuestion {
  id: string
  type: 'problem'
  content: string
  points: number
  solution: string
}

export interface JudgmentQuestion {
  id: string
  type: 'judgment'
  content: string
  points: number
  answer: 'true' | 'false'
  solution?: string
}

export interface LineQuestion {
  id: string
  type: 'line'
  content: string
  points: number
  leftItems: string[]
  rightItems: string[]
  connections: { left: number; right: number }[]
  solution?: string
}

export interface CalculationsQuestion {
  id: string
  type: 'calculations'
  content: string
  points: number
  items: string[]
  columns: number
  solution?: string
}

export interface WritingQuestion {
  id: string
  type: 'writing'
  content: string
  title: string
  points: number
}

export interface SelectQuestion {
  id: string
  type: 'select'
  content: string
  points: number
  items: { text: string; marked: boolean }[]
}

export interface ExamMaterial {
  id: string
  type: 'material'
  content: string
  title?: string
  author?: string
  source?: string
}

export interface ExamPoem {
  id: string
  type: 'poem'
  content: string
  title?: string
  author?: string
  annotations: { text: string; index: number }[]
}

export type NormalQuestion = ChoiceQuestion | FillinQuestion | ProblemQuestion | JudgmentQuestion | LineQuestion | CalculationsQuestion | WritingQuestion | SelectQuestion
export type ExamContent = ExamSection | ExamNote | ExamMaterial | ExamPoem | NormalQuestion
export type Question = NormalQuestion

export interface Exam {
  id: string
  info: ExamInfo
  examSetup: ExamSetupConfig
  contents: ExamContent[]
}

export function isQuestionContent(content: ExamContent): content is Question {
  return ['choice', 'fillin', 'problem', 'judgment', 'line', 'calculations', 'writing', 'select'].includes(content.type)
}

export function isMaterialContent(content: ExamContent): content is ExamMaterial {
  return content.type === 'material'
}

export function isPoemContent(content: ExamContent): content is ExamPoem {
  return content.type === 'poem'
}

export function isSectionContent(content: ExamContent): content is ExamSection {
  return content.type === 'section' || content.type === 'subsection'
}

export function isNoteContent(content: ExamContent): content is ExamNote {
  return content.type === 'note'
}

export function getQuestionContents(exam: Exam): Question[] {
  return exam.contents.filter(isQuestionContent)
}

export function calculateTotalPoints(exam: Exam): number {
  return getQuestionContents(exam).reduce((total, question) => total + (question.points || 0), 0)
}

export function normalizeExam(exam: Partial<Exam>): Exam {
  const legacyQuestions = Array.isArray((exam as any).questions) ? (exam as any).questions : []
  const legacyMaterials = Array.isArray((exam as any).materials) ? (exam as any).materials : []
  const legacyPoems = Array.isArray((exam as any).poems) ? (exam as any).poems : []
  const legacySections = Array.isArray((exam as any).sections) ? (exam as any).sections : []
  const contents = Array.isArray(exam.contents)
    ? exam.contents
    : [...legacySections, ...legacyMaterials, ...legacyPoems, ...legacyQuestions]

  const normalizedExam = {
    ...exam,
    contents,
  } as Exam

  normalizedExam.info = {
    ...normalizedExam.info,
    totalPoints: calculateTotalPoints(normalizedExam),
  }

  return normalizedExam
}
