import { AppBar, Toolbar as MuiToolbar, Typography, Button, Box, IconButton, Tooltip, Menu, MenuItem } from '@mui/material'
import { Save as SaveIcon, Download as DownloadIcon, Upload as UploadIcon, Undo as UndoIcon, Redo as RedoIcon, MoreVert as MoreVertIcon } from '@mui/icons-material'
import { useState, useRef } from 'react'
import { useExamStore } from '@/stores/examStore'
import { downloadLatex } from '@/utils/latexGenerator'
import { exportExamToJson, importExamFromJson } from '@/utils/importExport'

function Toolbar() {
  const { exam, actions } = useExamStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    console.log('保存')
  }

  const handleExportLatex = () => {
    downloadLatex(exam, 'exam.tex')
  }

  const handleExportJson = () => {
    exportExamToJson(exam, 'exam.json')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const importedExam = await importExamFromJson(file)
        actions.importExam(importedExam)
        alert('导入成功！')
      } catch (error) {
        alert(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
    // 清空 input，允许重复选择同一文件
    event.target.value = ''
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <MuiToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          exam-zh 网页版编辑器
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* 撤销/重做按钮 */}
          <Tooltip title="撤销">
            <span>
              <IconButton
                onClick={actions.undo}
                disabled={!actions.canUndo()}
                size="small"
              >
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="重做">
            <span>
              <IconButton
                onClick={actions.redo}
                disabled={!actions.canRedo()}
                size="small"
              >
                <RedoIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Box sx={{ width: 16 }} />

          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleImportClick}
          >
            导入
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            保存
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportLatex}
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          >
            导出 LaTeX
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </MuiToolbar>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 更多选项菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleExportJson(); handleMenuClose(); }}>
          导出 JSON
        </MenuItem>
        <MenuItem onClick={() => { handleImportClick(); handleMenuClose(); }}>
          导入 JSON
        </MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Toolbar
