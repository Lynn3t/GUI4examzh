import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import type { Question, QuestionType } from '@/types/exam'

function QuestionList() {
  const { exam, selectedQuestionId, actions } = useExamStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contextMenuQuestion, setContextMenuQuestion] = useState<string | null>(null)

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: actions.generateId(),
      type,
      content: '',
      points: 5,
      ...(type === 'choice' && { answer: 'A', options: ['', '', '', ''] }),
      ...(type === 'fillin' && { answer: '' }),
      ...(type === 'problem' && { solution: '' }),
      ...(type === 'judgment' && { answer: 'true' }),
      ...(type === 'line' && {
        leftItems: ['', ''],
        rightItems: ['', ''],
        connections: [],
      }),
    }
    actions.addQuestion(newQuestion)
    actions.selectQuestion(newQuestion.id)
  }

  const handleDeleteQuestion = (id: string) => {
    actions.deleteQuestion(id)
    setContextMenuQuestion(null)
  }

  const getQuestionLabel = (question: Question) => {
    const typeLabels: Record<QuestionType, string> = {
      choice: '选择题',
      fillin: '填空题',
      problem: '解答题',
      judgment: '判断题',
      line: '连线题',
    }
    return typeLabels[question.type]
  }

  const handleContextMenu = (event: React.MouseEvent, questionId: string) => {
    event.preventDefault()
    setContextMenuQuestion(questionId)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setContextMenuQuestion(null)
  }

  return (
    <Box>
      {/* 添加题目按钮 */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('choice')}
        >
          选择题
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('fillin')}
        >
          填空题
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('problem')}
        >
          解答题
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('judgment')}
        >
          判断题
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('line')}
        >
          连线题
        </Button>
      </Box>

      {/* 题目列表 */}
      <List dense>
        {exam.questions.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            暂无题目，请添加题目
          </Typography>
        ) : (
          exam.questions.map((question, index) => (
            <ListItem
              key={question.id}
              button
              selected={selectedQuestionId === question.id}
              onClick={() => actions.selectQuestion(question.id)}
              onContextMenu={(e) => handleContextMenu(e, question.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' },
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '&:hover': { bgcolor: 'action.selected' },
                },
              }}
            >
              <ListItemText
                primary={`${index + 1}. ${getQuestionLabel(question)}`}
                secondary={`${question.points} 分`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleContextMenu(e, question.id)
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>

      {/* 右键菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {contextMenuQuestion && (
          <MenuItem
            onClick={() => {
              handleDeleteQuestion(contextMenuQuestion)
              handleCloseMenu()
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            删除题目
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default QuestionList
