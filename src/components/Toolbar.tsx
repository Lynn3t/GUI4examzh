import { AppBar, Toolbar as MuiToolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material'
import { Save as SaveIcon, Download as DownloadIcon, Upload as UploadIcon, Undo as UndoIcon, Redo as RedoIcon } from '@mui/icons-material'
import { useExamStore } from '@/stores/examStore'
import { downloadLatex } from '@/utils/latexGenerator'

function Toolbar() {
  const { exam, actions } = useExamStore()

  const handleSave = () => {
    console.log('保存')
  }

  const handleExport = () => {
    downloadLatex(exam, 'exam.tex')
  }

  const handleImport = () => {
    console.log('导入')
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
            onClick={handleImport}
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
            onClick={handleExport}
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          >
            导出
          </Button>
        </Box>
      </MuiToolbar>
    </AppBar>
  )
}

export default Toolbar
