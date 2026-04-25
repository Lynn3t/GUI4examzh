// 试卷类型定义

export type QuestionType = 'choice' | 'fillin' | 'problem' | 'judgment' | 'line'

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

export type Question = ChoiceQuestion | FillinQuestion | ProblemQuestion | JudgmentQuestion | LineQuestion

export interface Exam {
  id: string
  info: ExamInfo
  questions: Question[]
}
