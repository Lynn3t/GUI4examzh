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

export interface ExamSetupExtraGroups {
  风格设置?: string
  师生两版?: string
  数学符号?: string
  页面补充?: string
  密封线?: string
  方格?: string
  字体?: string
  抬头补充?: string
  题干补充?: string
  选择题补充?: string
  填空题?: string
  解答题补充?: string
  列表环境?: string
  草稿纸?: string
  评分框?: string
  选择标记?: string
  连线题?: string
  语文相关?: string
  图文排版?: string
  计算题排版?: string
  其他参数?: string
}

export interface ExamSetupConfig {
  page?: ExamSetupPage
  title?: ExamSetupTitle
  question?: ExamSetupQuestion
  choices?: ExamSetupChoices
  paren?: ExamSetupParen
  solution?: ExamSetupSolution
  extraGroups?: ExamSetupExtraGroups
  extraRaw?: string
}

export interface ExamSection {
  id: string
  type: 'section' | 'subsection'
  title: string
  autoTitle?: boolean
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
  solution?: string
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

const autoSectionTitlePattern = /^[零〇一二两三四五六七八九十百千]+、新建大题（\d+分）$/
const autoSubsectionTitlePattern = /^（[零〇一二两三四五六七八九十百千]+）新建小节（本题共\d+小题，\d+分）$/

const chineseDigitMap: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
}

const chineseUnitMap: Record<string, number> = {
  十: 10,
  百: 100,
  千: 1000,
}

export function parseChineseSectionIndex(title: string): number | null {
  const match = title.trim().match(/^([零〇一二两三四五六七八九十百千]+)、/)
  return parseChineseNumber(match?.[1])
}

export function parseChineseSubsectionIndex(title: string): number | null {
  const match = title.trim().match(/^（([零〇一二两三四五六七八九十百千]+)）/)
  return parseChineseNumber(match?.[1])
}

function parseChineseNumber(text?: string): number | null {
  if (!text) return null

  let total = 0
  let current = 0

  for (const char of text) {
    if (char in chineseDigitMap) {
      current = chineseDigitMap[char]
      continue
    }

    if (char in chineseUnitMap) {
      const unit = chineseUnitMap[char]
      total += (current || 1) * unit
      current = 0
    }
  }

  return total + current || null
}

function toChineseIndex(value: number): string {
  if (value <= 0) return '一'

  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  if (value < 10) return digits[value]
  if (value < 20) return value === 10 ? '十' : `十${digits[value - 10]}`
  if (value < 100) {
    const tens = Math.floor(value / 10)
    const ones = value % 10
    return `${digits[tens]}十${ones === 0 ? '' : digits[ones]}`
  }

  const hundreds = Math.floor(value / 100)
  const remainder = value % 100
  if (remainder === 0) return `${digits[hundreds]}百`
  if (remainder < 10) return `${digits[hundreds]}百零${digits[remainder]}`
  return `${digits[hundreds]}百${toChineseIndex(remainder)}`
}

function getScopedQuestionStats(contents: ExamContent[], startIndex: number, stopTypes: Array<'section' | 'subsection'>): { count: number; points: number } {
  let count = 0
  let points = 0

  for (let index = startIndex + 1; index < contents.length; index += 1) {
    const item = contents[index]
    if (stopTypes.includes(item.type as 'section' | 'subsection')) break
    if (isQuestionContent(item)) {
      count += 1
      points += item.points || 0
    }
  }

  return { count, points }
}

function inferSectionAutoTitle(section: ExamSection): boolean {
  if (typeof section.autoTitle === 'boolean') return section.autoTitle
  if (section.type === 'section') return autoSectionTitlePattern.test(section.title.trim())
  return autoSubsectionTitlePattern.test(section.title.trim())
}

export function calculateSectionPoints(contents: ExamContent[], sectionId: string): number {
  const sectionIndex = contents.findIndex((item) => item.id === sectionId && item.type === 'section')
  if (sectionIndex < 0) return 0
  return getScopedQuestionStats(contents, sectionIndex, ['section']).points
}

export function calculateSubsectionStats(contents: ExamContent[], subsectionId: string): { count: number; points: number } {
  const subsectionIndex = contents.findIndex((item) => item.id === subsectionId && item.type === 'subsection')
  if (subsectionIndex < 0) return { count: 0, points: 0 }
  return getScopedQuestionStats(contents, subsectionIndex, ['section', 'subsection'])
}

export function formatAutoSectionTitle(index: number, points: number): string {
  return `${toChineseIndex(index)}、新建大题（${points}分）`
}

export function formatAutoSubsectionTitle(index: number, count: number, points: number): string {
  return `（${toChineseIndex(index)}）新建小节（本题共${count}小题，${points}分）`
}

function normalizeContents(contents: ExamContent[]): ExamContent[] {
  const nextContents = contents.map((item) => {
    if (!isSectionContent(item)) return item
    return { ...item, autoTitle: inferSectionAutoTitle(item) }
  })

  let previousSectionIndex: number | null = null
  let previousSubsectionIndex: number | null = null

  return nextContents.map((item) => {
    if (!isSectionContent(item)) return item

    if (item.type === 'section') {
      if (!item.autoTitle) {
        const parsedIndex = parseChineseSectionIndex(item.title)
        if (parsedIndex !== null) previousSectionIndex = parsedIndex
        previousSubsectionIndex = null
        return item
      }

      const nextIndex = previousSectionIndex === null ? (parseChineseSectionIndex(item.title) || 1) : previousSectionIndex + 1
      previousSectionIndex = nextIndex
      previousSubsectionIndex = null
      return {
        ...item,
        title: formatAutoSectionTitle(nextIndex, calculateSectionPoints(nextContents, item.id)),
      }
    }

    if (!item.autoTitle) {
      const parsedIndex = parseChineseSubsectionIndex(item.title)
      if (parsedIndex !== null) previousSubsectionIndex = parsedIndex
      return item
    }

    const nextIndex = previousSubsectionIndex === null ? (parseChineseSubsectionIndex(item.title) || 1) : previousSubsectionIndex + 1
    previousSubsectionIndex = nextIndex
    const stats = calculateSubsectionStats(nextContents, item.id)
    return {
      ...item,
      title: formatAutoSubsectionTitle(nextIndex, stats.count, stats.points),
    }
  })
}

export function getNextSectionTitle(contents: ExamContent[]): string {
  const lastSection = [...contents].reverse().find((item) => item.type === 'section') as ExamSection | undefined
  if (!lastSection) return formatAutoSectionTitle(1, 0)

  const currentIndex = parseChineseSectionIndex(lastSection.title) || 0
  return formatAutoSectionTitle(currentIndex + 1, 0)
}

export function getNextSubsectionTitle(contents: ExamContent[]): string {
  let currentIndex = 0

  for (let index = contents.length - 1; index >= 0; index -= 1) {
    const item = contents[index]
    if (item.type === 'section') break
    if (item.type === 'subsection') {
      currentIndex = parseChineseSubsectionIndex(item.title) || 0
      break
    }
  }

  return formatAutoSubsectionTitle(currentIndex + 1, 0, 0)
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
    contents: normalizeContents(contents),
  } as Exam

  normalizedExam.info = {
    ...normalizedExam.info,
    totalPoints: calculateTotalPoints(normalizedExam),
  }

  return normalizedExam
}
