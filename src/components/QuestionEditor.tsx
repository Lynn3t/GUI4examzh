import { Box, TextField, Typography, Button, Grid, IconButton, Tabs, Tab } from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import FormulaEditor from './FormulaEditor'
import type { Question, ChoiceQuestion, FillinQuestion, ProblemQuestion, JudgmentQuestion, LineQuestion } from '@/types/exam'

function QuestionEditor() {
  const { exam, selectedQuestionId, actions } = useExamStore()
  const [tabValue, setTabValue] = useState(0)
  const [formula, setFormula] = useState('')
  const question = exam.questions.find((q) => q.id === selectedQuestionId)

  if (!question) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>请选择一道题目进行编辑</Typography>
      </Box>
    )
  }

  const updateQuestion = (updates: Partial<Question>) => {
    if (selectedQuestionId) {
      actions.updateQuestion(selectedQuestionId, updates)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // 选择题编辑器
  const renderChoiceEditor = (q: ChoiceQuestion) => (
    <Box>
      <TextField
        fullWidth
        multiline
        label="题干"
        value={q.content}
        onChange={(e) => updateQuestion({ content: e.target.value })}
        margin="normal"
        rows={3}
      />
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        选项
      </Typography>
      {q.options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>
            {String.fromCharCode(65 + index)}.
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={option}
            onChange={(e) => {
              const newOptions = [...q.options]
              newOptions[index] = e.target.value
              updateQuestion({ options: newOptions })
            }}
          />
          <IconButton
            size="small"
            onClick={() => {
              if (q.options.length > 2) {
                const newOptions = q.options.filter((_, i) => i !== index)
                updateQuestion({ options: newOptions })
              }
            }}
            disabled={q.options.length <= 2}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          if (q.options.length < 8) {
            updateQuestion({ options: [...q.options, ''] })
          }
        }}
        disabled={q.options.length >= 8}
      >
        添加选项
      </Button>
      <TextField
        fullWidth
        label="正确答案"
        value={q.answer}
        onChange={(e) => updateQuestion({ answer: e.target.value.toUpperCase() })}
        margin="normal"
        helperText="输入 A、B、C、D 等"
      />
    </Box>
  )

  // 填空题编辑器
  const renderFillinEditor = (q: FillinQuestion) => (
    <Box>
      <TextField
        fullWidth
        multiline
        label="题干"
        value={q.content}
        onChange={(e) => updateQuestion({ content: e.target.value })}
        margin="normal"
        rows={3}
      />
      <TextField
        fullWidth
        label="答案"
        value={q.answer}
        onChange={(e) => updateQuestion({ answer: e.target.value })}
        margin="normal"
      />
    </Box>
  )

  // 解答题编辑器
  const renderProblemEditor = (q: ProblemQuestion) => (
    <Box>
      <TextField
        fullWidth
        multiline
        label="题干"
        value={q.content}
        onChange={(e) => updateQuestion({ content: e.target.value })}
        margin="normal"
        rows={4}
      />
      <TextField
        fullWidth
        multiline
        label="解答"
        value={q.solution}
        onChange={(e) => updateQuestion({ solution: e.target.value })}
        margin="normal"
        rows={6}
      />
    </Box>
  )

  // 判断题编辑器
  const renderJudgmentEditor = (q: JudgmentQuestion) => (
    <Box>
      <TextField
        fullWidth
        multiline
        label="题干"
        value={q.content}
        onChange={(e) => updateQuestion({ content: e.target.value })}
        margin="normal"
        rows={3}
      />
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        正确答案
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant={q.answer === 'true' ? 'contained' : 'outlined'}
          onClick={() => updateQuestion({ answer: 'true' })}
        >
          正确
        </Button>
        <Button
          variant={q.answer === 'false' ? 'contained' : 'outlined'}
          onClick={() => updateQuestion({ answer: 'false' })}
        >
          错误
        </Button>
      </Box>
    </Box>
  )

  // 连线题编辑器
  const renderLineEditor = (q: LineQuestion) => (
    <Box>
      <TextField
        fullWidth
        multiline
        label="题干"
        value={q.content}
        onChange={(e) => updateQuestion({ content: e.target.value })}
        margin="normal"
        rows={3}
      />
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        左侧项目
      </Typography>
      {q.leftItems.map((item, index) => (
        <Box key={`left-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{index + 1}.</Typography>
          <TextField
            fullWidth
            size="small"
            value={item}
            onChange={(e) => {
              const newItems = [...q.leftItems]
              newItems[index] = e.target.value
              updateQuestion({ leftItems: newItems })
            }}
          />
        </Box>
      ))}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        右侧项目
      </Typography>
      {q.rightItems.map((item, index) => (
        <Box key={`right-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 2, minWidth: 30 }}>{String.fromCharCode(65 + index)}.</Typography>
          <TextField
            fullWidth
            size="small"
            value={item}
            onChange={(e) => {
              const newItems = [...q.rightItems]
              newItems[index] = e.target.value
              updateQuestion({ rightItems: newItems })
            }}
          />
        </Box>
      ))}
    </Box>
  )

  return (
    <Box>
      {/* 题目类型和分数 */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <Typography variant="subtitle2" color="text.secondary">
            题目类型
          </Typography>
          <Typography variant="body1">
            {question.type === 'choice' && '选择题'}
            {question.type === 'fillin' && '填空题'}
            {question.type === 'problem' && '解答题'}
            {question.type === 'judgment' && '判断题'}
            {question.type === 'line' && '连线题'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="分数"
            type="number"
            value={question.points}
            onChange={(e) => updateQuestion({ points: parseInt(e.target.value) || 0 })}
            size="small"
          />
        </Grid>
      </Grid>

      {/* 标签页 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="题目编辑" />
          <Tab label="公式编辑器" />
        </Tabs>
      </Box>

      {/* 题目编辑标签页 */}
      {tabValue === 0 && (
        <Box sx={{ mt: 2 }}>
          {/* 题目类型特定的编辑器 */}
          {question.type === 'choice' && renderChoiceEditor(question)}
          {question.type === 'fillin' && renderFillinEditor(question)}
          {question.type === 'problem' && renderProblemEditor(question)}
          {question.type === 'judgment' && renderJudgmentEditor(question)}
          {question.type === 'line' && renderLineEditor(question)}
        </Box>
      )}

      {/* 公式编辑器标签页 */}
      {tabValue === 1 && (
        <Box sx={{ mt: 2 }}>
          <FormulaEditor
            value={formula}
            onChange={setFormula}
            label="公式编辑器（暂未集成到题目中）"
          />
        </Box>
      )}
    </Box>
  )
}

export default QuestionEditor
