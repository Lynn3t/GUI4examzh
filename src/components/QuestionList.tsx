import { Box, List, ListItemButton, ListItemIcon, ListItemText, Checkbox, IconButton, Typography, Button, Menu, MenuItem, Chip } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon, DragIndicator as DragIndicatorIcon, VerticalAlignTop as MoveTopIcon, VerticalAlignBottom as MoveBottomIcon } from '@mui/icons-material'
import { useMemo, useRef, useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import type { Question, QuestionType, ExamMaterial, ExamPoem, ExamSection, ExamContent, ExamNote } from '@/types/exam'
import { getNextSectionTitle, getNextSubsectionTitle, isMaterialContent, isNoteContent, isPoemContent, isQuestionContent, isSectionContent } from '@/types/exam'

function QuestionList() {
  const { exam, selectedQuestionId, selectedIds, actions } = useExamStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contextMenuId, setContextMenuId] = useState<string | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const dragOverIndex = useRef<number | null>(null)

  const contents = exam.contents || []
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const handleAddQuestion = (type: QuestionType) => {
    const id = actions.generateId()
    let newQuestion: Question

    switch (type) {
      case 'choice':
        newQuestion = { id, type: 'choice', content: '', points: 5, answer: 'A', options: ['', '', '', ''] }
        break
      case 'fillin':
        newQuestion = { id, type: 'fillin', content: '', points: 5, answer: '' }
        break
      case 'problem':
        newQuestion = { id, type: 'problem', content: '', points: 5, solution: '' }
        break
      case 'judgment':
        newQuestion = { id, type: 'judgment', content: '', points: 5, answer: 'true' }
        break
      case 'line':
        newQuestion = { id, type: 'line', content: '', points: 5, leftItems: ['', ''], rightItems: ['', ''], connections: [] }
        break
      case 'calculations':
        newQuestion = { id, type: 'calculations', content: '', points: 5, items: ['', '', '', ''], columns: 2 }
        break
      case 'writing':
        newQuestion = { id, type: 'writing', content: '', title: '', points: 60 }
        break
      case 'select':
        newQuestion = { id, type: 'select', content: '', points: 5, items: [{ text: '', marked: false }] }
        break
      default:
        return
    }

    actions.addQuestion(newQuestion)
    actions.selectQuestion(newQuestion.id)
    actions.setSortingMode(false)
  }

  const handleAddMaterial = () => {
    const newMaterial: ExamMaterial = { id: actions.generateId(), type: 'material', content: '', title: '', author: '', source: '' }
    actions.addMaterial(newMaterial)
    actions.selectQuestion(newMaterial.id)
    actions.setSortingMode(false)
  }

  const handleAddPoem = () => {
    const newPoem: ExamPoem = { id: actions.generateId(), type: 'poem', content: '', title: '', author: '', annotations: [] }
    actions.addPoem(newPoem)
    actions.selectQuestion(newPoem.id)
    actions.setSortingMode(false)
  }

  const handleAddSection = (type: 'section' | 'subsection') => {
    const section: ExamSection = {
      id: actions.generateId(),
      type,
      title: type === 'section' ? getNextSectionTitle(contents) : getNextSubsectionTitle(contents),
      autoTitle: true,
    }
    actions.addSection(section)
    actions.selectQuestion(section.id)
    actions.setSortingMode(false)
  }

  const handleAddNote = () => {
    const note: ExamNote = {
      id: actions.generateId(),
      type: 'note',
      content: '\\vspace{1em}\n\\noindent \\textbf{【注】}\\\\\n① 注释一。\\\\\n② 注释二。',
    }
    actions.addNote(note)
    actions.selectQuestion(note.id)
    actions.setSortingMode(false)
  }

  const getContentLabel = (content: ExamContent, index: number) => {
    if (isSectionContent(content)) {
      return content.type === 'section' ? `大题：${content.title}` : `小节：${content.title}`
    }
    if (isMaterialContent(content)) return `材料：${content.title || '未命名材料'}`
    if (isPoemContent(content)) return `古诗：${content.title || '未命名古诗'}`
    if (isNoteContent(content)) return `注释/说明 ${index + 1}`

    const typeLabels: Record<string, string> = {
      choice: '选择题',
      fillin: '填空题',
      problem: '解答题',
      judgment: '判断题',
      line: '连线题',
      calculations: '计算题',
      writing: '写作题',
      select: '选择标记',
    }
    return `${index + 1}. ${typeLabels[content.type]}`
  }

  const getMetaText = (content: ExamContent) => {
    if (isQuestionContent(content)) return `${content.points} 分`
    if (isSectionContent(content)) return content.type === 'section' ? '大题结构' : '小节结构'
    if (isNoteContent(content)) return '原样输出 LaTeX'
    return content.type === 'material' ? '语文材料结构' : '古诗结构'
  }

  const handleContextMenu = (event: React.MouseEvent, id: string) => {
    event.preventDefault()
    setContextMenuId(id)
    setAnchorEl(event.currentTarget as HTMLElement)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setContextMenuId(null)
  }

  const handleDeleteById = (id: string) => {
    const item = contents.find((content) => content.id === id)
    if (!item) return
    if (isQuestionContent(item)) actions.deleteQuestion(id)
    else if (isMaterialContent(item)) actions.deleteMaterial(id)
    else if (isPoemContent(item)) actions.deletePoem(id)
    else if (isSectionContent(item)) actions.deleteSection(id)
    else if (isNoteContent(item)) actions.deleteNote(id)
    handleCloseMenu()
  }

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

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddSection('section')}>大题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddSection('subsection')}>小节</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddNote}>注释</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddMaterial}>语文材料</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddPoem}>语文古诗</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('choice')}>选择题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('fillin')}>填空题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('problem')}>解答题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('judgment')}>判断题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('line')}>连线题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('calculations')}>计算题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('writing')}>写作题</Button>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddQuestion('select')}>选择标记</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button size="small" onClick={actions.selectAll}>全选</Button>
        <Button size="small" onClick={actions.clearSelection} disabled={selectedIds.length === 0}>清空选择</Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={actions.batchDelete} disabled={selectedIds.length === 0}>批量删除</Button>
        <Button size="small" startIcon={<MoveTopIcon />} onClick={() => actions.moveSelectedTo(0)} disabled={selectedIds.length === 0}>移到顶部</Button>
        <Button size="small" startIcon={<MoveBottomIcon />} onClick={() => actions.moveSelectedTo(contents.length)} disabled={selectedIds.length === 0}>移到底部</Button>
        {selectedIds.length > 0 && <Chip size="small" label={`已选 ${selectedIds.length} 项`} />}
      </Box>

      <List dense>
        {contents.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>暂无内容，请添加题目或结构块</Typography>
        ) : (
          contents.map((content, index) => (
            <ListItemButton
              key={content.id}
              selected={selectedQuestionId === content.id}
              onClick={() => {
                actions.selectQuestion(content.id)
                actions.setSortingMode(false)
              }}
              onContextMenu={(event) => handleContextMenu(event, content.id)}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDragEnd={handleDragEnd}
              onDrop={(event) => event.preventDefault()}
              sx={{ borderRadius: 1, mb: 0.5, opacity: draggingIndex === index ? 0.5 : 1 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }} onClick={(event) => event.stopPropagation()}>
                <Checkbox edge="start" checked={selectedSet.has(content.id)} onChange={() => actions.toggleSelectId(content.id)} />
              </ListItemIcon>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText primary={getContentLabel(content, index)} secondary={getMetaText(content)} />
              <IconButton
                edge="end"
                size="small"
                onClick={(event) => {
                  event.stopPropagation()
                  handleContextMenu(event, content.id)
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItemButton>
          ))
        )}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {contextMenuId && (
          <MenuItem onClick={() => handleDeleteById(contextMenuId)} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} />删除
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default QuestionList
