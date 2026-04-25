import type { Exam, Question, ChoiceQuestion, FillinQuestion, ProblemQuestion, JudgmentQuestion, LineQuestion } from '@/types/exam'

/**
 * 将试卷数据转换为 LaTeX 代码
 */
export function generateLatex(exam: Exam): string {
  let latex = ''

  // 文档类和导言区
  latex += `% exam-zh 试卷生成器\n`
  latex += `% 生成时间: ${new Date().toLocaleString()}\n\n`
  latex += `\\documentclass{exam-zh}\n\n`
  latex += `\\begin{document}\n\n`

  // 试卷抬头
  latex += `\\title{${exam.info.title}}\n`
  if (exam.info.subject) {
    latex += `\\subject{${exam.info.subject}}\n`
  }
  latex += `\\maketitle\n\n`

  // 考生信息
  latex += `\\information{\n`
  latex += `  ${exam.info.information.name}\\underline{\\hspace{6em}},\n`
  latex += `  ${exam.info.information.class}\\underline{\\hspace{6em}},\n`
  latex += `  ${exam.info.information.studentId}\\underline{\\hspace{4em}}\n`
  latex += `}\n\n`

  // 考试注意事项
  latex += `\\begin{notice}\n`
  latex += `  \\item 本试卷共 ${exam.questions.length} 题，满分 ${exam.info.totalPoints} 分。\n`
  latex += `  \\item 请用黑色签字笔在答题卡上作答。\n`
  latex += `  \\item 考试结束后，将试卷和答题卡一并交回。\n`
  latex += `\\end{notice}\n\n`

  latex += `\\vspace{1em}\n\n`

  // 题目部分
  exam.questions.forEach((question, index) => {
    latex += generateQuestionLatex(question, index + 1)
  })

  latex += `\n\\end{document}`

  return latex
}

/**
 * 生成单个题目的 LaTeX 代码
 */
function generateQuestionLatex(question: Question, index: number): string {
  let latex = ''

  switch (question.type) {
    case 'choice':
      latex += generateChoiceQuestionLatex(question, index)
      break
    case 'fillin':
      latex += generateFillinQuestionLatex(question, index)
      break
    case 'problem':
      latex += generateProblemQuestionLatex(question, index)
      break
    case 'judgment':
      latex += generateJudgmentQuestionLatex(question, index)
      break
    case 'line':
      latex += generateLineQuestionLatex(question, index)
      break
  }

  return latex
}

/**
 * 生成选择题 LaTeX 代码
 */
function generateChoiceQuestionLatex(question: ChoiceQuestion, index: number): string {
  let latex = ''

  latex += `\\begin{question}[points = ${question.points}]\n`
  latex += `  ${question.content} \\paren[${question.answer}]\n`
  latex += `  \\begin{choices}\n`

  question.options.forEach((option) => {
    if (option.trim()) {
      latex += `    \\item ${option}\n`
    }
  })

  latex += `  \\end{choices}\n`
  latex += `\\end{question}\n\n`

  return latex
}

/**
 * 生成填空题 LaTeX 代码
 */
function generateFillinQuestionLatex(question: FillinQuestion, index: number): string {
  let latex = ''

  latex += `\\begin{question}[points = ${question.points}]\n`
  latex += `  ${question.content} \\fillin[${question.answer}]\n`
  latex += `\\end{question}\n\n`

  return latex
}

/**
 * 生成解答题 LaTeX 代码
 */
function generateProblemQuestionLatex(question: ProblemQuestion, index: number): string {
  let latex = ''

  latex += `\\begin{problem}[points = ${question.points}]\n`
  latex += `  ${question.content}\n\n`

  if (question.solution) {
    latex += `  \\begin{solution}\n`
    latex += `    ${question.solution}\n`
    latex += `  \\end{solution}\n`
  }

  latex += `\\end{problem}\n\n`

  return latex
}

/**
 * 生成判断题 LaTeX 代码
 */
function generateJudgmentQuestionLatex(question: JudgmentQuestion, index: number): string {
  let latex = ''

  latex += `\\begin{question}[points = ${question.points}]\n`
  latex += `  ${question.content} \\paren[${question.answer === 'true' ? '对' : '错'}]\n`
  latex += `\\end{question}\n\n`

  return latex
}

/**
 * 生成连线题 LaTeX 代码
 */
function generateLineQuestionLatex(question: LineQuestion, index: number): string {
  let latex = ''

  latex += `\\begin{question}[points = ${question.points}]\n`
  latex += `  ${question.content}\n\n`
  latex += `  \\begin{lineto}\n`

  // 左侧项目
  latex += `    \\linelistset{name = left}{\n`
  question.leftItems.forEach((item, i) => {
    if (item.trim()) {
      latex += `      ${item}${i < question.leftItems.length - 1 ? ',' : ''}\n`
    }
  })
  latex += `    }\n\n`

  // 右侧项目
  latex += `    \\linelistset{name = right}{\n`
  question.rightItems.forEach((item, i) => {
    if (item.trim()) {
      latex += `      ${item}${i < question.rightItems.length - 1 ? ',' : ''}\n`
    }
  })
  latex += `    }\n\n`

  // 连线关系
  if (question.connections.length > 0) {
    const connections = question.connections
      .map((c) => `left-${c.left + 1},right-${c.right + 1}`)
      .join(',')
    latex += `    \\lineconnect{${connections}}\n`
  }

  latex += `  \\end{lineto}\n`
  latex += `\\end{question}\n\n`

  return latex
}

/**
 * 导出 LaTeX 文件
 */
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
