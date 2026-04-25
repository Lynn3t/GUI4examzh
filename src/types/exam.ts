// 试卷类型定义

export type QuestionType = 'choice' | 'fillin' | 'problem' | 'judgment' | 'line' | 'calculations' | 'material' | 'poem' | 'writing' | 'select'

export interface ExamInfo {
  title: string
  subject: string
  examTime: string
  totalPoints: number
  information: {
    name: string
    class: string
    studentId: string
  }
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
  items: string[] // 计算题项列表
  columns: number // 列数
  solution?: string
}

export interface MaterialQuestion {
  id: string
  type: 'material'
  content: string
  title?: string
  author?: string
  source?: string
  points: number
}

export interface PoemQuestion {
  id: string
  type: 'poem'
  content: string
  title?: string
  author?: string
  points: number
  annotations: { text: string; index: number }[] // 注释列表
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
  items: { text: string; marked: boolean }[] // 选项列表，marked 表示是否被标记
}

export type Question = ChoiceQuestion | FillinQuestion | ProblemQuestion | JudgmentQuestion | LineQuestion | CalculationsQuestion | MaterialQuestion | PoemQuestion | WritingQuestion | SelectQuestion

export interface Exam {
  id: string
  info: ExamInfo
  questions: Question[]
}
