import { Box, TextField, Typography, Button, Grid, IconButton, Tabs, Tab } from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import FormulaEditor from './FormulaEditor'
import ImageProcessor from './ImageProcessor'
import GeometryDrawer from './GeometryDrawer'
import type { Question, ChoiceQuestion, FillinQuestion, ProblemQuestion, JudgmentQuestion, LineQuestion, CalculationsQuestion, ExamMaterial, ExamPoem, WritingQuestion, SelectQuestion, ExamSection, ExamNote } from '@/types/exam'
import { isMaterialContent, isNoteContent, isPoemContent, isQuestionContent, isSectionContent } from '@/types/exam'

function QuestionEditor() {
  const { exam, selectedQuestionId, isSortingMode, actions } = useExamStore()
  const [tabValue, setTabValue] = useState(0)
  const [formula, setFormula] = useState('')

  const selectedContent = exam.contents.find((item) => item.id === selectedQuestionId)
  const question = selectedContent && isQuestionContent(selectedContent) ? selectedContent : null
  const material = selectedContent && isMaterialContent(selectedContent) ? selectedContent : null
  const poem = selectedContent && isPoemContent(selectedContent) ? selectedContent : null
  const section = selectedContent && isSectionContent(selectedContent) ? selectedContent : null
  const note = selectedContent && isNoteContent(selectedContent) ? selectedContent : null

  const closeEditor = () => {
    actions.selectQuestion(null)
    actions.setSortingMode(true)
    setTabValue(0)
  }

  const appendToQuestionContent = (snippet: string) => {
    if (!question) return
    actions.updateQuestion(question.id, { content: `${question.content}${question.content ? '\n' : ''}${snippet}` })
  }

  if (isSortingMode || !selectedContent) {
    return (
      <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>当前为排序模式</Typography>
        <Typography>左侧可拖拽排序、批量勾选、批量删除或移动。</Typography>
        <Typography sx={{ mt: 1 }}>点击任一题目、材料、古诗或结构块即可进入编辑界面。</Typography>
      </Box>
    )
  }

  const updateQuestion = (updates: Partial<Question>) => {
    if (question) actions.updateQuestion(question.id, updates)
  }

  const renderChoiceEditor = (q: ChoiceQuestion) => (
    <Box>
      <TextField fullWidth multiline label="题干" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={4} />
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>选项</Typography>
      {q.options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{String.fromCharCode(65 + index)}.</Typography>
          <TextField
            fullWidth
            size="small"
            value={option}
            onChange={(e) => {
              const next = [...q.options]
              next[index] = e.target.value
              updateQuestion({ options: next })
            }}
          />
          <IconButton size="small" onClick={() => q.options.length > 2 && updateQuestion({ options: q.options.filter((_, i) => i !== index) })} disabled={q.options.length <= 2}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => q.options.length < 8 && updateQuestion({ options: [...q.options, ''] })}>添加选项</Button>
      <TextField fullWidth label="正确答案" value={q.answer} onChange={(e) => updateQuestion({ answer: e.target.value.toUpperCase() })} margin="normal" helperText="输入 A、B、C、D 等" />
      <TextField fullWidth multiline label="解析" value={q.solution || ''} onChange={(e) => updateQuestion({ solution: e.target.value })} margin="normal" rows={4} />
    </Box>
  )

  const renderFillinEditor = (q: FillinQuestion) => (
    <Box>
      <TextField fullWidth multiline label="题干" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={4} />
      <TextField fullWidth label="答案" value={q.answer} onChange={(e) => updateQuestion({ answer: e.target.value })} margin="normal" />
      <TextField fullWidth multiline label="解析" value={q.solution || ''} onChange={(e) => updateQuestion({ solution: e.target.value })} margin="normal" rows={4} />
    </Box>
  )

  const renderProblemEditor = (q: ProblemQuestion) => (
    <Box>
      <TextField fullWidth multiline label="题干" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={6} />
      <TextField fullWidth multiline label="答案/解析" value={q.solution} onChange={(e) => updateQuestion({ solution: e.target.value })} margin="normal" rows={8} />
    </Box>
  )

  const renderJudgmentEditor = (q: JudgmentQuestion) => (
    <Box>
      <TextField fullWidth multiline label="题干" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={4} />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant={q.answer === 'true' ? 'contained' : 'outlined'} onClick={() => updateQuestion({ answer: 'true' })}>正确</Button>
        <Button variant={q.answer === 'false' ? 'contained' : 'outlined'} onClick={() => updateQuestion({ answer: 'false' })}>错误</Button>
      </Box>
      <TextField fullWidth multiline label="解析" value={q.solution || ''} onChange={(e) => updateQuestion({ solution: e.target.value })} margin="normal" rows={4} />
    </Box>
  )

  const renderLineEditor = (q: LineQuestion) => (
    <Box>
      <TextField fullWidth multiline label="题干" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={4} />
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>左侧项目</Typography>
      {q.leftItems.map((item, index) => (
        <Box key={`left-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{index + 1}.</Typography>
          <TextField fullWidth size="small" value={item} onChange={(e) => {
            const next = [...q.leftItems]
            next[index] = e.target.value
            updateQuestion({ leftItems: next })
          }} />
        </Box>
      ))}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>右侧项目</Typography>
      {q.rightItems.map((item, index) => (
        <Box key={`right-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{String.fromCharCode(65 + index)}.</Typography>
          <TextField fullWidth size="small" value={item} onChange={(e) => {
            const next = [...q.rightItems]
            next[index] = e.target.value
            updateQuestion({ rightItems: next })
          }} />
        </Box>
      ))}
      <TextField fullWidth multiline label="解析" value={q.solution || ''} onChange={(e) => updateQuestion({ solution: e.target.value })} margin="normal" rows={4} />
    </Box>
  )

  const renderCalculationsEditor = (q: CalculationsQuestion) => (
    <Box>
      <TextField fullWidth multiline label="题干" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={3} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField fullWidth label="列数" type="number" value={q.columns} onChange={(e) => updateQuestion({ columns: parseInt(e.target.value, 10) || 2 })} size="small" inputProps={{ min: 1, max: 4 }} />
        </Grid>
      </Grid>
      {q.items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{index + 1}.</Typography>
          <TextField fullWidth size="small" value={item} onChange={(e) => {
            const next = [...q.items]
            next[index] = e.target.value
            updateQuestion({ items: next })
          }} />
          <IconButton size="small" onClick={() => updateQuestion({ items: q.items.filter((_, i) => i !== index) })}><RemoveIcon /></IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => updateQuestion({ items: [...q.items, ''] })}>添加计算题项</Button>
      <TextField fullWidth multiline label="解析" value={q.solution || ''} onChange={(e) => updateQuestion({ solution: e.target.value })} margin="normal" rows={4} />
    </Box>
  )

  const renderMaterialEditor = (q: ExamMaterial) => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}><TextField fullWidth label="标题" value={q.title || ''} onChange={(e) => actions.updateMaterial(q.id, { title: e.target.value })} size="small" /></Grid>
        <Grid item xs={6}><TextField fullWidth label="作者" value={q.author || ''} onChange={(e) => actions.updateMaterial(q.id, { author: e.target.value })} size="small" /></Grid>
      </Grid>
      <TextField fullWidth label="来源" value={q.source || ''} onChange={(e) => actions.updateMaterial(q.id, { source: e.target.value })} size="small" margin="normal" />
      <TextField fullWidth multiline label="材料内容" value={q.content} onChange={(e) => actions.updateMaterial(q.id, { content: e.target.value })} margin="normal" rows={10} />
    </Box>
  )

  const renderPoemEditor = (q: ExamPoem) => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}><TextField fullWidth label="标题" value={q.title || ''} onChange={(e) => actions.updatePoem(q.id, { title: e.target.value })} size="small" /></Grid>
        <Grid item xs={6}><TextField fullWidth label="作者" value={q.author || ''} onChange={(e) => actions.updatePoem(q.id, { author: e.target.value })} size="small" /></Grid>
      </Grid>
      <TextField fullWidth multiline label="古诗内容（使用 {1}、{2} 等标记注释）" value={q.content} onChange={(e) => actions.updatePoem(q.id, { content: e.target.value })} margin="normal" rows={8} />
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>注释</Typography>
      {q.annotations.map((annotation, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{index + 1}.</Typography>
          <TextField fullWidth size="small" value={annotation.text} onChange={(e) => {
            const next = [...q.annotations]
            next[index] = { ...next[index], text: e.target.value }
            actions.updatePoem(q.id, { annotations: next })
          }} />
          <IconButton size="small" onClick={() => actions.updatePoem(q.id, { annotations: q.annotations.filter((_, i) => i !== index) })}><RemoveIcon /></IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => actions.updatePoem(q.id, { annotations: [...q.annotations, { text: '', index: q.annotations.length + 1 }] })}>添加注释</Button>
    </Box>
  )

  const renderWritingEditor = (q: WritingQuestion) => (
    <Box>
      <TextField fullWidth label="作文标题" value={q.title} onChange={(e) => updateQuestion({ title: e.target.value })} margin="normal" size="small" />
      <TextField fullWidth multiline label="作文要求" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={6} />
    </Box>
  )

  const renderSelectEditor = (q: SelectQuestion) => (
    <Box>
      <TextField fullWidth multiline label="题干" value={q.content} onChange={(e) => updateQuestion({ content: e.target.value })} margin="normal" rows={3} />
      {q.items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{index + 1}.</Typography>
          <TextField fullWidth size="small" value={item.text} onChange={(e) => {
            const next = [...q.items]
            next[index] = { ...next[index], text: e.target.value }
            updateQuestion({ items: next })
          }} />
          <Button size="small" variant={item.marked ? 'contained' : 'outlined'} onClick={() => {
            const next = [...q.items]
            next[index] = { ...next[index], marked: !item.marked }
            updateQuestion({ items: next })
          }} sx={{ ml: 1 }}>{item.marked ? '✓' : '○'}</Button>
          <IconButton size="small" onClick={() => updateQuestion({ items: q.items.filter((_, i) => i !== index) })}><RemoveIcon /></IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => updateQuestion({ items: [...q.items, { text: '', marked: false }] })}>添加选项</Button>
    </Box>
  )

  const renderSectionEditor = (q: ExamSection) => (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>结构块类型</Typography>
      <Typography sx={{ mb: 2 }}>{q.type === 'section' ? '大题' : '小节'}</Typography>
      <TextField fullWidth multiline label="标题" value={q.title} onChange={(e) => actions.updateSection(q.id, { title: e.target.value, autoTitle: false })} rows={3} />
    </Box>
  )

  const renderNoteEditor = (q: ExamNote) => (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>此内容会按原样输出到 LaTeX，可用于注释、额外说明、留白等。</Typography>
      <TextField fullWidth multiline label="LaTeX 内容" value={q.content} onChange={(e) => actions.updateNote(q.id, { content: e.target.value })} rows={10} />
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">内容编辑</Typography>
        <IconButton onClick={closeEditor} size="small"><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Button size="small" variant="outlined" onClick={() => appendToQuestionContent('\\underline{\\hspace{8em}}')}>插入下划线</Button>
        <Button size="small" variant="outlined" onClick={() => appendToQuestionContent('\\vspace{1em}\n\\noindent \\textbf{【注】}\\\\')}>插入注释模板</Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_event, newValue) => setTabValue(newValue)}>
          <Tab label="内容编辑" />
          <Tab label="公式编辑器" />
          <Tab label="图片处理" />
          <Tab label="几何绘图" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box sx={{ mt: 2 }}>
          {question && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <TextField fullWidth label="分数" type="number" value={question.points} onChange={(e) => updateQuestion({ points: parseInt(e.target.value, 10) || 0 })} size="small" />
                </Grid>
              </Grid>
              {question.type === 'choice' && renderChoiceEditor(question)}
              {question.type === 'fillin' && renderFillinEditor(question)}
              {question.type === 'problem' && renderProblemEditor(question)}
              {question.type === 'judgment' && renderJudgmentEditor(question)}
              {question.type === 'line' && renderLineEditor(question)}
              {question.type === 'calculations' && renderCalculationsEditor(question)}
              {question.type === 'writing' && renderWritingEditor(question)}
              {question.type === 'select' && renderSelectEditor(question)}
            </>
          )}
          {material && renderMaterialEditor(material)}
          {poem && renderPoemEditor(poem)}
          {section && renderSectionEditor(section)}
          {note && renderNoteEditor(note)}
        </Box>
      )}

      {tabValue === 1 && <Box sx={{ mt: 2 }}><FormulaEditor value={formula} onChange={setFormula} label="公式编辑器" /></Box>}
      {tabValue === 2 && <Box sx={{ mt: 2 }}><ImageProcessor onImageInsert={appendToQuestionContent} /></Box>}
      {tabValue === 3 && <Box sx={{ mt: 2 }}><GeometryDrawer onInsertSvg={appendToQuestionContent} /></Box>}
    </Box>
  )
}

export default QuestionEditor
