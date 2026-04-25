import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Button, Menu, MenuItem, Divider } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material'
import { useState, useRef } from 'react'
import { useExamStore } from '@/stores/examStore'
import type { Question, QuestionType, ExamMaterial, ExamPoem } from '@/types/exam'

function QuestionList() {
  const { exam, selectedQuestionId, actions } = useExamStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contextMenuType, setContextMenuType] = useState<'question' | 'material' | 'poem' | null>(null)
  const [contextMenuId, setContextMenuId] = useState<string | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const dragOverIndex = useRef<number | null>(null)

  const handleAddQuestion = (type: QuestionType) => {
    const id = actions.generateId()
    let newQuestion: Question

    switch (type) {
      case 'choice':
        newQuestion = {
          id,
          type: 'choice',
          content: '',
          points: 5,
          answer: 'A',
          options: ['', '', '', ''],
        }
        break
      case 'fillin':
        newQuestion = {
          id,
          type: 'fillin',
          content: '',
          points: 5,
          answer: '',
        }
        break
      case 'problem':
        newQuestion = {
          id,
          type: 'problem',
          content: '',
          points: 5,
          solution: '',
        }
        break
      case 'judgment':
        newQuestion = {
          id,
          type: 'judgment',
          content: '',
          points: 5,
          answer: 'true',
        }
        break
      case 'line':
        newQuestion = {
          id,
          type: 'line',
          content: '',
          points: 5,
          leftItems: ['', ''],
          rightItems: ['', ''],
          connections: [],
        }
        break
      case 'calculations':
        newQuestion = {
          id,
          type: 'calculations',
          content: '',
          points: 5,
          items: ['', '', '', ''],
          columns: 2,
        }
        break
      case 'writing':
        newQuestion = {
          id,
          type: 'writing',
          content: '',
          title: '',
          points: 5,
        }
        break
      case 'select':
        newQuestion = {
          id,
          type: 'select',
          content: '',
          points: 5,
          items: [{ text: '', marked: false }],
        }
        break
      default:
        return
    }

    actions.addQuestion(newQuestion)
    actions.selectQuestion(newQuestion.id)
  }

  const handleAddMaterial = () => {
    const id = actions.generateId()
    const newMaterial: ExamMaterial = {
      id,
      type: 'material',
      content: '',
      title: '',
      author: '',
      source: '',
    }
    actions.addMaterial(newMaterial)
  }

  const handleAddPoem = () => {
    const id = actions.generateId()
    const newPoem: ExamPoem = {
      id,
      type: 'poem',
      content: '',
      title: '',
      author: '',
      annotations: [],
    }
    actions.addPoem(newPoem)
  }

  const handleDeleteQuestion = (id: string) => {
    actions.deleteQuestion(id)
    handleCloseMenu()
  }

  const handleDeleteMaterial = (id: string) => {
    actions.deleteMaterial(id)
    handleCloseMenu()
  }

  const handleDeletePoem = (id: string) => {
    actions.deletePoem(id)
    handleCloseMenu()
  }

  const getQuestionLabel = (question: Question) => {
    const typeLabels: Record<string, string> = {
      choice: '选择题',
      fillin: '填空题',
      problem: '解答题',
      judgment: '判断题',
      line: '连线题',
      calculations: '计算题',
      writing: '英语作文',
      select: '选择标记',
    }
    return typeLabels[question.type]
  }

  const getMaterialLabel = (material: ExamMaterial) => {
    return material.title || '语文材料'
  }

  const getPoemLabel = (poem: ExamPoem) => {
    return poem.title || '语文古诗'
  }

  const handleContextMenu = (event: React.MouseEvent, type: 'question' | 'material' | 'poem', id: string) => {
    event.preventDefault()
    setContextMenuType(type)
    setContextMenuId(id)
    setAnchorEl(event.currentTarget as HTMLElement)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setContextMenuType(null)
    setContextMenuId(null)
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
          onClick={handleAddMaterial}
        >
          语文材料
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddPoem}
        >
          语文古诗
        </Button>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
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

      {/* 语文材料列表 */}
      <List dense sx={{ mb: 2 }}>
        {exam.materials.map((material) => (
          <ListItem
            key={material.id}
            button
            selected={selectedQuestionId === material.id}
            onClick={() => actions.selectQuestion(material.id)}
            onContextMenu={(e) => handleContextMenu(e, 'material', material.id)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              borderLeft: '3px solid',
              borderLeftColor: 'primary.main',
              '&:hover': { bgcolor: 'action.hover' },
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                '&:hover': { bgcolor: 'action.selected' },
              },
            }}
          >
            <ListItemText
              primary={`材料：${getMaterialLabel(material)}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleContextMenu(e, 'material', material.id)
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* 语文古诗列表 */}
      <List dense sx={{ mb: 2 }}>
        {exam.poems.map((poem) => (
          <ListItem
            key={poem.id}
            button
            selected={selectedQuestionId === poem.id}
            onClick={() => actions.selectQuestion(poem.id)}
            onContextMenu={(e) => handleContextMenu(e, 'poem', poem.id)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              borderLeft: '3px solid',
              borderLeftColor: 'secondary.main',
              '&:hover': { bgcolor: 'action.hover' },
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                '&:hover': { bgcolor: 'action.selected' },
              },
            }}
          >
            <ListItemText
              primary={`古诗：${getPoemLabel(poem)}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleContextMenu(e, 'poem', poem.id)
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* 题目列表 */}
      <List dense>
        {exam.questions.length === 0 && exam.materials.length === 0 && exam.poems.length === 0 ? (
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
              onContextMenu={(e) => handleContextMenu(e, 'question', question.id)}
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
                    handleContextMenu(e, 'question', question.id)
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
        {contextMenuId && contextMenuType === 'question' && (
          <MenuItem
            onClick={() => {
              handleDeleteQuestion(contextMenuId)
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            删除题目
          </MenuItem>
        )}
        {contextMenuId && contextMenuType === 'material' && (
          <MenuItem
            onClick={() => {
              handleDeleteMaterial(contextMenuId)
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            删除材料
          </MenuItem>
        )}
        {contextMenuId && contextMenuType === 'poem' && (
          <MenuItem
            onClick={() => {
              handleDeletePoem(contextMenuId)
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            删除古诗
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default QuestionList
