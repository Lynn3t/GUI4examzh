import type { Exam, Question, ChoiceQuestion, FillinQuestion, ProblemQuestion, JudgmentQuestion, LineQuestion, CalculationsQuestion, WritingQuestion, SelectQuestion, ExamMaterial, ExamPoem, ExamContent, ExamSection, ExamNote } from '@/types/exam'
import { calculateTotalPoints, isMaterialContent, isNoteContent, isPoemContent, isQuestionContent, isSectionContent } from '@/types/exam'

function escapeLatex(value: string): string {
  return value
}

function generateExamSetup(exam: Exam): string {
  const { examSetup } = exam
  const preAnalysis = (examSetup.solution?.preAnalysis || []).filter((item) => item.trim())
  const preAnalysisValue = preAnalysis.length === 0 ? '{}' : `{${preAnalysis.join(' ')}}`
  const extraRaw = examSetup.extraRaw?.trim()
  const extraGroups = Object.values(examSetup.extraGroups || {})
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
  const extraBlocks = [...extraGroups, ...(extraRaw ? [extraRaw] : [])]

  return `\\examsetup{
  page = {
    size = ${examSetup.page?.size || 'a4paper'},
    show-head = ${String(Boolean(examSetup.page?.showHead))},
    show-foot = ${String(Boolean(examSetup.page?.showFoot))},
    foot-content = ${examSetup.page?.footContent || ''}
  },
  title = {
    title-format = ${examSetup.title?.titleFormat || '\\huge\\bfseries'},
    subject-format = ${examSetup.title?.subjectFormat || '\\Large\\bfseries'},
  },
  question = {
    show-points = ${examSetup.question?.showPoints || 'auto'},
  },
  choices = {
    label-sep = ${examSetup.choices?.labelSep || '0.5em'},
  },
  paren = {
    show-paren = ${String(Boolean(examSetup.paren?.showParen))},
    type = ${examSetup.paren?.type || 'hfill'},
  },
  solution = {
    show-solution = ${examSetup.solution?.showSolution || 'show-move'},
    pre-analysis = ${preAnalysisValue},
    score-showleader = ${String(Boolean(examSetup.solution?.scoreShowleader))},
  }${extraBlocks.length ? `,\n${extraBlocks.join(',\n')}\n` : ''}
}
`
}

export function generateLatex(exam: Exam): string {
  const totalPoints = calculateTotalPoints(exam)
  let latex = ''

  latex += `% exam-zh 试卷生成器\n`
  latex += `% 生成时间: ${new Date().toLocaleString()}\n\n`
  latex += `\\documentclass[a4paper]{exam-zh}\n\n`
  latex += `${generateExamSetup(exam)}\n`
  latex += `\\begin{document}\n\n`
  latex += `\\title{${escapeLatex(exam.info.title)}}\n`
  if (exam.info.subject) latex += `\\subject{${escapeLatex(exam.info.subject)}}\n`
  latex += `\\maketitle\n\n`
  latex += `\\information{\n`
  exam.info.information.fields.forEach((field, index) => {
    const width = field.width || 6
    latex += `  ${field.label}\\underline{\\hspace{${width}em}}${index < exam.info.information.fields.length - 1 ? ',' : ''}\n`
  })
  latex += `}\n\n`
  latex += `\\vspace{1em}\n`
  latex += `\\begin{notice}\n`
  latex += `  \\item 本试卷满分 \\textbf{${totalPoints}分}，考试时间 \\textbf{${exam.info.examTime || '未设置'}}。\n`
  latex += `  \\item 回答选择题时，请将答案填涂在答题卡上。\n`
  latex += `  \\item 回答非选择题时，请将答案写在答题卡上。\n`
  latex += `\\end{notice}\n\n`

  exam.contents.forEach((content) => {
    latex += generateContentLatex(content)
  })

  latex += `\\n\\end{document}`
  return latex
}

function generateContentLatex(content: ExamContent): string {
  if (isSectionContent(content)) return generateSectionLatex(content)
  if (isMaterialContent(content)) return generateMaterialLatex(content)
  if (isPoemContent(content)) return generatePoemLatex(content)
  if (isNoteContent(content)) return generateNoteLatex(content)
  if (isQuestionContent(content)) return generateQuestionLatex(content)
  return ''
}

function generateSectionLatex(section: ExamSection): string {
  const command = section.type === 'section' ? '\\section*' : '\\subsection*'
  return `${command}{${section.title}}\n\n`
}

function generateNoteLatex(note: ExamNote): string {
  return `${note.content}\n\n`
}

function generateQuestionLatex(question: Question): string {
  switch (question.type) {
    case 'choice':
      return generateChoiceQuestionLatex(question)
    case 'fillin':
      return generateFillinQuestionLatex(question)
    case 'problem':
      return generateProblemQuestionLatex(question)
    case 'judgment':
      return generateJudgmentQuestionLatex(question)
    case 'line':
      return generateLineQuestionLatex(question)
    case 'calculations':
      return generateCalculationsQuestionLatex(question)
    case 'writing':
      return generateWritingQuestionLatex(question)
    case 'select':
      return generateSelectQuestionLatex(question)
  }
}

function wrapSolution(solution?: string): string {
  if (!solution?.trim()) return ''
  return `\\begin{solution}\n${solution}\n\\end{solution}\n\n`
}

function generateChoiceQuestionLatex(question: ChoiceQuestion): string {
  let latex = `\\begin{question}[points=${question.points}]\n${question.content} \\paren\n\\begin{choices}\n`
  question.options.forEach((option) => {
    if (option.trim()) latex += `  \\item ${option}\n`
  })
  latex += `\\end{choices}\n\\end{question}\n\n`
  latex += wrapSolution(question.solution || `\\textbf{${question.answer}}`)
  return latex
}

function generateFillinQuestionLatex(question: FillinQuestion): string {
  let latex = `\\begin{question}[points=${question.points}]\n${question.content}\n\\end{question}\n\n`
  latex += wrapSolution(question.solution || question.answer)
  return latex
}

function generateProblemQuestionLatex(question: ProblemQuestion): string {
  let latex = `\\begin{problem}[points=${question.points}]\n${question.content}\n\\end{problem}\n\n`
  latex += wrapSolution(question.solution)
  return latex
}

function generateJudgmentQuestionLatex(question: JudgmentQuestion): string {
  let latex = `\\begin{question}[points=${question.points}]\n${question.content} \\paren\n\\end{question}\n\n`
  latex += wrapSolution(question.solution || (question.answer === 'true' ? '正确' : '错误'))
  return latex
}

function generateLineQuestionLatex(question: LineQuestion): string {
  let latex = `\\begin{question}[points=${question.points}]\n${question.content}\n\\begin{lineto}\n`
  latex += `  \\linelistset{name = left}{${question.leftItems.filter(Boolean).join(', ')}}\n`
  latex += `  \\linelistset{name = right}{${question.rightItems.filter(Boolean).join(', ')}}\n`
  if (question.connections.length > 0) {
    latex += `  \\lineconnect{${question.connections.map((item) => `left-${item.left + 1},right-${item.right + 1}`).join(',')}}\n`
  }
  latex += `\\end{lineto}\n\\end{question}\n\n`
  latex += wrapSolution(question.solution)
  return latex
}

function generateCalculationsQuestionLatex(question: CalculationsQuestion): string {
  let latex = `\\begin{question}[points=${question.points}]\n${question.content}\n\\begin{calculations}[columns=${question.columns}]\n`
  question.items.forEach((item) => {
    if (item.trim()) latex += `  \\item ${item}\n`
  })
  latex += `\\end{calculations}\n\\end{question}\n\n`
  latex += wrapSolution(question.solution)
  return latex
}

function generateMaterialLatex(material: ExamMaterial): string {
  const options: string[] = []
  if (material.title) options.push(`title={${material.title}}`)
  if (material.author) options.push(`author={${material.author}}`)
  if (material.source) options.push(`source={${material.source}}`)
  return `\\begin{material}${options.length ? `[${options.join(', ')}]` : ''}\n${material.content}\n\\end{material}\n\n`
}

function generatePoemLatex(poem: ExamPoem): string {
  const options: string[] = []
  if (poem.title) options.push(`title={${poem.title}}`)
  if (poem.author) options.push(`author={${poem.author}}`)
  let content = poem.content
  poem.annotations.forEach((annotation, index) => {
    content = content.replace(`{${index + 1}}`, `\\textsuperscript{${annotation.index}}`)
  })
  return `\\begin{poem}${options.length ? `[${options.join(', ')}]` : ''}\n${content}\n\\end{poem}\n\n`
}

function generateWritingQuestionLatex(question: WritingQuestion): string {
  return `\\begin{problem}[points=${question.points}]\n${question.content}\n\n\\vspace{10cm}\n\\begin{center}\n  \\textcolor{gray}{（请在专用答题卡上的作文格内作答）}\n\\end{center}\n\\end{problem}\n\n`
}

function generateSelectQuestionLatex(question: SelectQuestion): string {
  let latex = `\\begin{question}[points=${question.points}]\n${question.content}\n\\begin{select}\n`
  question.items.forEach((item) => {
    if (item.text.trim()) latex += `  ${item.marked ? '\\sitem*' : '\\sitem'} ${item.text}\n`
  })
  latex += `\\end{select}\n\\end{question}\n\n`
  return latex
}

export function downloadLatex(exam: Exam, filename: string = 'exam.tex'): void {
  const latex = generateLatex(exam)
  const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
