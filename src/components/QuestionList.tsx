import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material'
import { useState, useRef } from 'react'
import { useExamStore } from '@/stores/examStore'
import type { Question, QuestionType } from '@/types/exam'

function QuestionList() {
  const { exam, selectedQuestionId, actions } = useExamStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contextMenuQuestion, setContextMenuQuestion] = useState<string | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const dragOverIndex = useRef<number | null>(null)

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
      ...(type === 'calculations' && {
        items: ['', '', '', ''],
        columns: 2,
      }),
      ...(type === 'material' && {
        content: '',
        title: '',
        author: '',
        source: '',
      }),
      ...(type === 'poem' && {
        content: '',
        title: '',
        author: '',
        annotations: [],
      }),
      ...(type === 'writing' && {
        content: '',
        title: '',
      }),
      ...(type === 'select' && {
        content: '',
        items: [{ text: '', marked: false }],
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
      calculations: '计算题',
      material: '语文材料',
      poem: '语文古诗',
      writing: '英语作文',
      select: '选择标记',
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

  // 拖拽事件处理
  const handleDragStart = (event: React.DragEvent, index: number) => {
    setDraggingIndex(index)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault()
    if (draggingIndex !== null && draggingIndex !== index) {
      dragOverIndex.current = index
    }
  }

  const handleDragEnd = () => {
    if (draggingIndex !== null && dragOverIndex.current !== null) {
      actions.moveQuestion(draggingIndex, dragOverIndex.current)
    }
    setDraggingIndex(null)
    dragOverIndex.current = null
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
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
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('calculations')}
        >
          计算题
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('material')}
        >
          语文材料
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('poem')}
        >
          语文古诗
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('writing')}
        >
          英语作文
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddQuestion('select')}
        >
          选择标记
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
              draggable
              selected={selectedQuestionId === question.id}
              onClick={() => actions.selectQuestion(question.id)}
              onContextMenu={(e) => handleContextMenu(e, question.id)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                opacity: draggingIndex === index ? 0.5 : 1,
                '&:hover': { bgcolor: 'action.hover' },
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '&:hover': { bgcolor: 'action.selected' },
                },
              }}
            >
              <DragIndicatorIcon
                sx={{
                  mr: 1,
                  cursor: 'grab',
                  color: 'text.secondary',
                }}
              />
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
